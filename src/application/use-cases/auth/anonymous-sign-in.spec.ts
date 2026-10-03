import AnonymousSignInUseCase from './anonymous-sign-in';
import UserRepository from '../../../domain/user/user.repository';
import DeviceRepository from '../../../domain/device/device.repository';
import SessionRepository from '../../../domain/session/session.repository';
import JobService from '../../../infrastructure/job/service';
import DbService from '../../../infrastructure/db/service';
import AuthService from '../../../infrastructure/auth/service';
import UserProtoMapper from '../../../infrastructure/grpc/mappers/user.proto.mapper';
import DeviceId from '../../../domain/device/value-objects/device-id.vo';
import UserEntity from '../../../domain/user/user.entity';
import DeviceEntity from '../../../domain/device/device.entity';
import SessionEntity from '../../../domain/session/session.entity';

describe('AnonymousSignInUseCase', () => {
    let useCase: AnonymousSignInUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockDeviceRepository: jest.Mocked<DeviceRepository>;
    let mockSessionRepository: jest.Mocked<SessionRepository>;
    let mockJobService: jest.Mocked<JobService>;
    let mockDbService: jest.Mocked<DbService>;
    let mockAuthService: jest.Mocked<AuthService>;
    let mockUserProtoMapper: jest.Mocked<typeof UserProtoMapper>;
    const userCreatedTopic = 'user.created';

    const mockDeviceId = new DeviceId('test-device-id');
    const mockUserId = {value: 'user-123', equals: jest.fn().mockReturnValue(true)};

    beforeEach(() => {
        mockUserRepository = {
            findById: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        mockDeviceRepository = {
            findByDeviceId: jest.fn(),
            save: jest.fn(),
        } as unknown as jest.Mocked<DeviceRepository>;

        mockSessionRepository = {
            save: jest.fn(),
            findByRefreshToken: jest.fn(),
        } as unknown as jest.Mocked<SessionRepository>;

        mockJobService = {
            enqueue: jest.fn(),
        } as unknown as jest.Mocked<JobService>;

        mockDbService = {
            transaction: jest.fn(),
        } as unknown as jest.Mocked<DbService>;

        mockAuthService = {
            generateAccessToken: jest.fn().mockReturnValue('access-token'),
            generateRefreshToken: jest.fn().mockReturnValue('refresh-token'),
        } as unknown as jest.Mocked<AuthService>;

        mockUserProtoMapper = {
            toProto: jest.fn().mockReturnValue({id: 'user-123'}),
        } as unknown as jest.Mocked<typeof UserProtoMapper>;

        useCase = new AnonymousSignInUseCase(
            mockUserRepository,
            mockDeviceRepository,
            mockSessionRepository,
            mockJobService,
            mockDbService,
            mockAuthService,
            userCreatedTopic,
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create new user and device when device not found', async () => {
        const mockUser = UserEntity.create();
        const mockDevice = DeviceEntity.create({deviceId: mockDeviceId, userId: mockUser.id});
        const mockSession = SessionEntity.create({
            userId: mockUser.id,
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });

        mockDeviceRepository.findByDeviceId.mockResolvedValue(null);
        mockUserRepository.save.mockResolvedValue(undefined);
        mockDeviceRepository.save.mockResolvedValue(undefined);
        mockSessionRepository.save.mockResolvedValue(undefined);
        mockJobService.enqueue.mockResolvedValue(undefined);

        // Mock transaction to execute callback
        mockDbService.transaction.mockImplementation(async (callback) => {
            return callback({} as any);
        });

        // Mock repository findById to return user
        mockUserRepository.findById.mockResolvedValue(mockUser);

        const result = await useCase.execute(mockDeviceId);

        expect(mockDeviceRepository.findByDeviceId).toHaveBeenCalledWith(mockDeviceId);
        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(mockDeviceRepository.save).toHaveBeenCalled();
        expect(mockSessionRepository.save).toHaveBeenCalled();
        expect(mockJobService.enqueue).toHaveBeenCalledWith(userCreatedTopic, expect.any(Object));
        expect(result).toBeInstanceOf(SessionEntity);
    });

    it('should return existing session for existing device', async () => {
        const mockUser = UserEntity.create();
        const mockDevice = DeviceEntity.create({deviceId: mockDeviceId, userId: mockUser.id});
        const mockSession = SessionEntity.create({
            userId: mockUser.id,
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
        });

        mockDeviceRepository.findByDeviceId.mockResolvedValue(mockDevice);
        mockUserRepository.findById.mockResolvedValue(mockUser);
        mockSessionRepository.save.mockResolvedValue(undefined);

        mockDbService.transaction.mockImplementation(async (callback) => {
            return callback({} as any);
        });

        const result = await useCase.execute(mockDeviceId);

        expect(mockDeviceRepository.findByDeviceId).toHaveBeenCalledWith(mockDeviceId);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(mockDevice.userId);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
        expect(mockDeviceRepository.save).not.toHaveBeenCalled();
        expect(mockJobService.enqueue).not.toHaveBeenCalled();
        expect(result).toBeInstanceOf(SessionEntity);
    });

    it('should create device if user exists but device does not', async () => {
        const mockUser = UserEntity.create();
        const mockDevice = DeviceEntity.create({deviceId: mockDeviceId, userId: mockUser.id});

        mockDeviceRepository.findByDeviceId.mockResolvedValue(null);
        mockUserRepository.findById.mockResolvedValue(mockUser);
        mockUserRepository.save.mockResolvedValue(undefined);
        mockDeviceRepository.save.mockResolvedValue(undefined);
        mockSessionRepository.save.mockResolvedValue(undefined);

        mockDbService.transaction.mockImplementation(async (callback) => {
            return callback({} as any);
        });

        const result = await useCase.execute(mockDeviceId);

        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(mockDeviceRepository.save).toHaveBeenCalled();
        expect(mockJobService.enqueue).toHaveBeenCalled();
        expect(result).toBeInstanceOf(SessionEntity);
    });
});
