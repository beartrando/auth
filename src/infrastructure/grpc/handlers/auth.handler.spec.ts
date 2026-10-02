import AuthHandler from './auth.handler';
import AnonymousSignInUseCase from '../../../application/use-cases/auth/anonymous-sign-in';
import RefreshTokensUseCase from '../../../application/use-cases/auth/refresh-tokens';
import LogoutUseCase from '../../../application/use-cases/auth/logout';
import GetUserUseCase from '../../../application/use-cases/auth/get-user';
import AuthService from '../../../infrastructure/auth/service';
import SessionProtoMapper from '../mappers/session.proto.mapper';
import UserProtoMapper from '../mappers/user.proto.mapper';
import DeviceDeviceId from '../../../domain/device/value-objects/device-device-id.vo';
import UserId from '../../../domain/user/value-objects/user-id.vo';
import SessionRefreshToken from '../../../domain/session/value-objects/sesion-refresh-token.vo';
import SessionEntity from '../../../domain/session/session.entity';
import UserEntity from '../../../domain/user/user.entity';
import SessionAccessToken from '../../../domain/session/value-objects/session-access-token.vo';
import * as authProto from '../../../contracts/proto/auth';
import * as responseProto from '../../../contracts/proto/common/response';
import * as emptyProto from '../../../contracts/proto/common/empty';
import AuthHelper from '../helpers/auth.helper';

jest.mock('../helpers/auth.helper');

describe('AuthHandler', () => {
  let handler: AuthHandler;
  let mockAnonymousSignInUseCase: jest.Mocked<AnonymousSignInUseCase>;
  let mockRefreshTokensUseCase: jest.Mocked<RefreshTokensUseCase>;
  let mockLogoutUseCase: jest.Mocked<LogoutUseCase>;
  let mockGetUserUseCase: jest.Mocked<GetUserUseCase>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockSessionProtoMapper: jest.Mocked<typeof SessionProtoMapper>;
  let mockUserProtoMapper: jest.Mocked<typeof UserProtoMapper>;
  let mockCallback: jest.Mock;

  beforeEach(() => {
    mockAnonymousSignInUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<AnonymousSignInUseCase>;

    mockRefreshTokensUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokensUseCase>;

    mockLogoutUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<LogoutUseCase>;

    mockGetUserUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetUserUseCase>;

    mockAuthService = {
      verifyRefreshToken: jest.fn(),
      verifyAccessToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    mockSessionProtoMapper = {
      toProto: jest.fn().mockReturnValue({accessToken: 'access', refreshToken: 'refresh'}),
    } as unknown as jest.Mocked<typeof SessionProtoMapper>;

    mockUserProtoMapper = {
      toProto: jest.fn().mockReturnValue({id: 'user-123', email: 'test@test.com'}),
    } as unknown as jest.Mocked<typeof UserProtoMapper>;

    (AuthHelper.getAccessToken as jest.Mock).mockReturnValue(
      new SessionAccessToken('test-token')
    );

    handler = new AuthHandler(
      mockAnonymousSignInUseCase,
      mockRefreshTokensUseCase,
      mockLogoutUseCase,
      mockGetUserUseCase,
      mockAuthService,
    );

    mockCallback = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('anonymousSignIn', () => {
    it('should call anonymousSignInUseCase and return session response', async () => {
      const mockSession = SessionEntity.create({
        userId: new UserId('user-123'),
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      mockAnonymousSignInUseCase.execute.mockResolvedValue(mockSession);

      const mockCall = {
        request: {deviceId: 'device-123'},
      };

      await handler.anonymousSignIn(mockCall as any, mockCallback);

      expect(mockAnonymousSignInUseCase.execute).toHaveBeenCalledWith(
        expect.any(DeviceDeviceId),
      );
      expect(mockCallback).toHaveBeenCalledWith(null, expect.any(Object));
    });

    it('should call callbackError on error', async () => {
      const error = new Error('Sign in failed');
      mockAnonymousSignInUseCase.execute.mockRejectedValue(error);

      const mockCall = {
        request: {deviceId: 'device-123'},
      };

      await handler.anonymousSignIn(mockCall as any, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({code: expect.any(Number), details: 'Sign in failed'}),
        null
      );
    });
  });

  describe('refreshTokens', () => {
    it('should verify token, refresh tokens, and return session response', async () => {
      const mockSession = SessionEntity.create({
        userId: new UserId('user-123'),
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });

      mockAuthService.verifyRefreshToken.mockReturnValue(new UserId('user-123'));
      mockRefreshTokensUseCase.execute.mockResolvedValue(mockSession);

      const mockCall = {
        request: {token: 'refresh-token'},
      };

      await handler.refreshTokens(mockCall as any, mockCallback);

      expect(mockAuthService.verifyRefreshToken).toHaveBeenCalledWith(
        expect.any(SessionRefreshToken),
      );
      expect(mockRefreshTokensUseCase.execute).toHaveBeenCalledWith(
        expect.any(UserId),
        expect.any(SessionRefreshToken),
      );
      expect(mockCallback).toHaveBeenCalledWith(null, expect.any(Object));
    });

    it('should call callbackError on error', async () => {
      mockAuthService.verifyRefreshToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const mockCall = {
        request: {token: 'invalid-token'},
      };

      await handler.refreshTokens(mockCall as any, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({code: expect.any(Number), details: 'Invalid token'}),
        null
      );
    });
  });

  describe('logout', () => {
    it('should verify access token and call logout use case', async () => {
      mockAuthService.verifyAccessToken.mockReturnValue(new UserId('user-123'));
      mockLogoutUseCase.execute.mockResolvedValue(undefined);

      const mockCall = {
        request: {},
        metadata: new Map([['authorization', 'Bearer access-token']]),
      };

      await handler.logout(mockCall as any, mockCallback);

      expect(mockAuthService.verifyAccessToken).toHaveBeenCalled();
      expect(mockLogoutUseCase.execute).toHaveBeenCalledWith(expect.any(UserId));
      expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
        success: true,
      }));
    });
  });

  describe('get', () => {
    it('should call getUserUseCase and return user response', async () => {
      const mockUser = UserEntity.create();

      mockGetUserUseCase.execute.mockResolvedValue(mockUser);
      (AuthHelper.getAccessToken as jest.Mock).mockReturnValue(new SessionAccessToken('test-token'));

      const metadata = new Map();
      metadata.set('authorization', 'Bearer access-token');

      const mockCall = {
        request: {userId: 'user-123'},
        metadata,
      };

      await handler.get(mockCall as any, mockCallback);

      expect(AuthHelper.getAccessToken).toHaveBeenCalled();
      expect(mockGetUserUseCase.execute).toHaveBeenCalledWith(expect.any(UserId));
      // UserProtoMapper is statically imported, verify callback instead
      expect(mockCallback).toHaveBeenCalledWith(null, expect.objectContaining({
        user: expect.any(Object),
      }));
    });

    it('should call callbackError on error', async () => {
      mockGetUserUseCase.execute.mockRejectedValue(new Error('User not found'));
      (AuthHelper.getAccessToken as jest.Mock).mockReturnValue(new SessionAccessToken('test-token'));

      const metadata = new Map();
      metadata.set('authorization', 'Bearer access-token');

      const mockCall = {
        request: {userId: 'user-123'},
        metadata,
      };

      await handler.get(mockCall as any, mockCallback);

      expect(mockCallback).toHaveBeenCalledWith(
        expect.objectContaining({code: expect.any(Number), details: 'User not found'}),
        null
      );
    });
  });
});