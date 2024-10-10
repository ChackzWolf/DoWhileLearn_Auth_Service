import jwt, { Secret } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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