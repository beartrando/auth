import GetUserUseCase from './get-user';
import UserRepository from '../../../domain/user/user.repository';
import UserEntity from '../../../domain/user/user.entity';
import UserId from '../../../domain/user/value-objects/user-id.vo';

describe('GetUserUseCase', () => {
    let useCase: GetUserUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;

    const mockUserId = new UserId('user-123');

    beforeEach(() => {
        mockUserRepository = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        useCase = new GetUserUseCase(mockUserRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user when found', async () => {
        const mockUser = UserEntity.create();
        mockUserRepository.findById.mockResolvedValue(mockUser);

        const result = await useCase.execute(mockUserId);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUserId);
        expect(result).toBe(mockUser);
    });

    it('should throw error when user not found', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(useCase.execute(mockUserId)).rejects.toThrow('User does not exist');
    });
});
