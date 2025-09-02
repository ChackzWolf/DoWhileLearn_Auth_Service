import * as grpc from '@grpc/grpc-js';
import { HandleRefreshResponse, isAuthenticatedRequest, isAuthenticatedResponse, RefreshTokenRequest } from '../../contracts/auth.types';

export interface IAuthController {
    HandleRefresh(call: grpc.ServerUnaryCall<RefreshTokenRequest, HandleRefreshResponse>, callback: grpc.sendUnaryData<HandleRefreshResponse>): Promise<void>
    isAuthenticated(call: grpc.ServerUnaryCall<isAuthenticatedRequest, isAuthenticatedResponse>, callback: grpc.sendUnaryData<isAuthenticatedResponse>): Promise<void>
}