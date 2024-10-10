import logger from '../logger';
import jwt, { Secret } from 'jsonwebtoken';
import "dotenv/config";
import * as grpc from '@grpc/grpc-js';
import { AuthService } from '../Services/Auth.service';


const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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
    isAuthenticated = async (data: any) => { 
        try {
            console.log("Token validating...", data);
            const token = data.token || '';
            const decoded: any = jwt.verify(token, JWT_SECRET|| "NO_KEY" as Secret);
            console.log(decoded,'decoded decode')
            if (!decoded) {
                console.log('decoded not found')
                return { success: false, userId: null, role: null };
            }
            
            return { success: true, userId: decoded.id, role: decoded.role };
        } catch (e: any) { 
            console.log('we got error 1')
            handleError(e); // Using handleError to log the error
            return { success: false, userId: null, role: null };
        }
    }

    HHandleRefresh = async (data: any) => {
        try {
            console.log("Token refreshing...",data.request.refreshToken );
    
            // Extract the refresh token from data
            const refreshtoken = data.request.refreshToken as string;
       
            // Verify the provided refresh token
            const decoded: any = jwt.verify(refreshtoken, REFRESH_TOKEN_SECRET || "NO_KEY" as Secret);
            console.log("Token refreshed");
    
            // If the refresh token is invalid, handle the error gracefully
            if (!decoded) {
                console.log('Invalid token decoding');
                return { success: false, message: "Invalid refresh token" };
            }
    
            // Generate new tokens
            const refreshToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                REFRESH_TOKEN_SECRET || "NO_KEY" as Secret,
                { expiresIn: "7d" }  // Adjust expiration time as necessary
            );
    
            const accessToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                JWT_SECRET || "NO_KEY" as Secret,
                { expiresIn: "1m" }  // Shorter expiration time for access tokens
            );
        
            console.log('Tokens generated successfully');
    
            // Return the new tokens
            return {
                success: true,
                accessToken,
                refreshToken, 
                message: "Tokens refreshed successfully"
            };
    
        } catch (e: any) {
            console.error("Error during token verification:", e);  // Log the error
            return {
                success: false,
                message: "Token refresh failed"
            };
        }
    }
}
