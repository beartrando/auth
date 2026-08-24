import DeviceRepository from "../../../domain/device/device.repository";
import UserRepository from "../../../domain/user/user.repository";
import DeviceId from "../../../domain/device/value-objects/device-id.vo";
import AuthObject from "../../../domain/auth/value-objects/auth-object.vo";
import UserEntity from "../../../domain/user/user.entity";
import DeviceEntity from "../../../domain/device/device.entity";
import SessionEntity from "../../../domain/session/session.entity";
import DbService from "../../../infrastructure/db/service";
import SessionRepository from "../../../domain/session/session.repository";
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

    async execute(deviceId: DeviceId): Promise<AuthObject> {
        let user: UserEntity | null = null;

        let device = await this.deviceRepository.findByDeviceId(deviceId);

        if (device) {
            user = await this.userRepository.findById(device.userId);
        }

        const session = await this.dbService.transaction(async (tx) => {
            if (!user) {
                user = UserEntity.create()
                await this.userRepository.save(user);

                const userObject = UserProtoMapper.toProto(user);
                await this.jobService.enqueue(this.userCreatedTopic, userObject);
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


            return session;
        })

        return new AuthObject(session.accessToken, session.refreshToken);
    }
}

export default AnonymousSignInUseCase;
