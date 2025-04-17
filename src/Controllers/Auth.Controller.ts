import logger from '../logger';
import * as grpc from '@grpc/grpc-js';
import { AuthService } from '../Services/Auth.service';
import { configs } from '../Configs/ENV-configs/ENV.configs';

const JWT_SECRET = configs.JWT_SECRET;
const REFRESH_TOKEN_SECRET = configs.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environmental variables. "
  );
}
 
const handleError = (error: Error) => {
    logger.error(error.message);                                                            
};
const service = new AuthService()
 
export class AuthController {

    async HandleRefresh(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>): Promise<void> {
        try {
            const refreshToken = call.request.refreshToken
            console.log(refreshToken,'refresh token from controller')
            const response = await service.refreshToken(refreshToken);
            callback(null,response)
        } catch (error) {
            
        }
    }

    isAuthenticated = async (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>):Promise<void> => { 
        try {
            const {accessToken ,  role} = call.request;
            console.log("Token validating...", call.request);
            const token = accessToken || '';
            const response = await service.roleBasedAuth({token,role});
            console.log(response)
            callback(null, response)
        } catch (e: any) { 
            console.log('we got error 1')
            handleError(e); // Using handleError to log the error
            callback(null, {success:false, message: `An Error occured ${e}`})
        }
    }
}
