import DeviceRepository from "../../../domain/repositories/device.repository";
import UserRepository from "../../../domain/repositories/user.repository";
import DeviceId from "../../../domain/value-objects/device/device-id.vo";
import Auth from "../../../domain/value-objects/auth.vo";
import UserEntity from "../../../domain/entities/user.entity";
import DeviceEntity from "../../../domain/entities/device.entity";
import SessionEntity from "../../../domain/entities/session.entity";
import DbService from "../../../infrastructure/db/service";
import SessionRepository from "../../../domain/repositories/session.repository";
import JobService from "../../../infrastructure/job/service";
import AuthService from "../../../infrastructure/auth/service";
import UserProtoMapper from "../../../infrastructure/grpc/mappers/user.proto.mapper";

export class AnonymousSignInUseCase {

    constructor(
        private readonly userRepository: UserRepository,
        private readonly deviceRepository: DeviceRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly jobService: JobService,
        private readonly dbService: DbService,
        private readonly authService: AuthService,
        private readonly userCreatedTopic: string,
    ) {
    }

    async execute(deviceId: DeviceId): Promise<Auth> {
        let user: UserEntity | null = null;

        let device = await this.deviceRepository.findByDeviceId(deviceId);

        if (device) {
            user = await this.userRepository.findById(device.userId);
        }

        const session = await this.dbService.transaction(async (tx) => {
            if (!user) {
                user = UserEntity.create()
                await this.userRepository.save(user);
            }

            if (!device) {
                device = DeviceEntity.create({deviceId, userId: user.id})
                await this.deviceRepository.save(device);
            }

            const accessToken = this.authService.generateAccessToken(user.id);
            const refreshToken = this.authService.generateRefreshToken(user.id);

            const session = SessionEntity.create({
                userId: user.id,
                accessToken,
                refreshToken,
            });

            await this.sessionRepository.save(session);

            const userObject = UserProtoMapper.toProto(user);

            await this.jobService.enqueueTx(this.userCreatedTopic, userObject, tx);

            return session;
        })

        return new Auth(session.accessToken, session.refreshToken);
    }
}

export default AnonymousSignInUseCase;
