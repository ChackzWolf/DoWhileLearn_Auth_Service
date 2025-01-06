import jwt, { Secret } from 'jsonwebtoken';
import { configs } from '../Configs/ENV-configs/ENV.configs';
const JWT_SECRET = configs.JWT_SECRET;
const REFRESH_TOKEN_SECRET = configs.REFRESH_TOKEN_SECRET;

if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in environmental variables. "
  );
}


export class AuthService {
    async refreshToken (refreshtoken: any)  {
        try {

       
            // Verify the provided refresh token
            const decoded: any = jwt.verify(refreshtoken, REFRESH_TOKEN_SECRET || "NO_KEY" as Secret);
            console.log("Token refreshed", decoded);
    
            // If the refresh token is invalid, handle the error gracefully
            if (!decoded) {
                console.log('Invalid token decoding');
                return { success: false, message: "Invalid refresh token" };
            }
    
            // Generate new tokens
            const refreshToken = jwt.sign(
                { id: decoded.id, role: decoded.role },
                REFRESH_TOKEN_SECRET || "NO_KEY" as Secret,
                { expiresIn: "10d" }  // Adjust expiration time as necessary
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


    async roleBasedAuth(data:{role:string,token:string}){
        const {role,token} = data;
        const decoded: any = jwt.verify(token, JWT_SECRET|| "NO_KEY" as Secret);
        console.log(decoded,'decoded decode')
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