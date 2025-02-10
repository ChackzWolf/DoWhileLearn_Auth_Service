import * as grpc from '@grpc/grpc-js';
export declare class AuthController {
    HandleRefresh(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void>;
    isAuthenticated: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => Promise<void>;
}
