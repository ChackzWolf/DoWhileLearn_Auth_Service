import jwt, { Secret } from 'jsonwebtoken';
import { configs } from '../Configs/ENV-configs/ENV.configs';
import { IAuthService } from './interfaces/IAuth-jwt-service';
import { refreshTokenRequest, roleBasedAuthRequest, roleBasedAuthResponse } from './types/Auth-jwt.service.types';
import { DecodedToken } from '../types/types';
const JWT_SECRET = configs.JWT_SECRET;
const REFRESH_TOKEN_SECRET = configs.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environmental variables. "
  );
}


export class AuthService implements IAuthService {


    async refreshToken (refreshtoken: string): Promise<refreshTokenRequest> {
        try {

       
            const decoded = jwt.verify(refreshtoken, REFRESH_TOKEN_SECRET || "NO_KEY" as Secret) as DecodedToken;
            if (!decoded) {
                console.log('Invalid token decoding');
                return { success: false, message: "Invalid refresh token" };
            }
    
            const refreshToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                REFRESH_TOKEN_SECRET || "NO_KEY" as Secret,
                { expiresIn: "10d" }  
            );
    
            const accessToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                JWT_SECRET || "NO_KEY" as Secret,
                { expiresIn: "1m" }  
            );
    
            console.log('Tokens generated successfully');
    
            return {
                success: true,
                accessToken,
                refreshToken, 
                message: "Tokens refreshed successfully"
            };
    
        } catch (e: any) {
            console.error("Error during token verification:", e);  
            return {
                success: false,
                message: "Token refresh failed"
            };
        }
    }


    async roleBasedAuth(data: roleBasedAuthRequest): Promise<roleBasedAuthResponse>{
        const {role,token} = data;
        const decoded: any = jwt.verify(token, JWT_SECRET|| "NO_KEY" as Secret) as DecodedToken;
        if (!decoded) {
            console.log('decoded not found') 
            return {
                success: false,
                message: "Could'nt decode"
            };
        }
        if(decoded.role !== role){
            console.log("role deos'nt match")
            return {
                success: false,
                message: "Not autherized"
            };
        }
        console.log('role matched')
        return {
            success: true,
            message: "Is Autherized"
        };
    }
}