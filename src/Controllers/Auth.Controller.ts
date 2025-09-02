import logger from '../Configs/logger.config';
import * as grpc from '@grpc/grpc-js';
import { AuthService } from '../Services/Auth-jwt.service';
import { configs } from '../Configs/ENV-configs/ENV.configs';
import { HandleRefreshResponse, isAuthenticatedRequest, isAuthenticatedResponse, RefreshTokenRequest } from '../contracts/auth.types';
import { IAuthController } from './interfaces/IAuth.Controller';

const { JWT_SECRET, REFRESH_TOKEN_SECRET } = configs;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environment variables.");
}

const handleError = (error: Error) => {
  logger.error(error.message);
};

const service = new AuthService();

export class AuthController implements IAuthController {
  async HandleRefresh(call: grpc.ServerUnaryCall<RefreshTokenRequest, HandleRefreshResponse>, callback: grpc.sendUnaryData<HandleRefreshResponse> ): Promise<void> {
    try {
      const { refreshToken } = call.request;
      const response = await service.refreshToken(refreshToken);
      callback(null, response);
    } catch (error) {
      handleError(error as Error);
      callback({
        code: grpc.status.INTERNAL,
        message: error instanceof Error ? error.message : 'Refresh token failed',
      } as grpc.ServiceError, null);
    }
  }

  async isAuthenticated (call: grpc.ServerUnaryCall<isAuthenticatedRequest, isAuthenticatedResponse>, callback: grpc.sendUnaryData<isAuthenticatedResponse>): Promise<void>  {
    try {
      const { accessToken = '', role } = call.request;
      const response = await service.roleBasedAuth({ token: accessToken, role });
      callback(null, response);
    } catch (error) {
      handleError(error as Error);
      callback(null, {
        success: false,
        message: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  };
}
