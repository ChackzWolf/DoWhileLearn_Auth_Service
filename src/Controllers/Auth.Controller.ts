import logger from '../logger';
import jwt, { Secret } from 'jsonwebtoken';
import "dotenv/config";


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
 
export class AuthController {
    isAuthenticated = async (data: any) => { 
        try {
            console.log("Token validating...", data);
            const token = data.token || '';
            const decoded: any = jwt.verify(token, JWT_SECRET|| "NO_KEY" as Secret);
            
            if (!decoded) {
                return { success: false, userId: null, role: null };
            }
            
            return { success: true, userId: decoded.id, role: decoded.role };
        } catch (e: any) {
            handleError(e); // Using handleError to log the error
            return { success: false, userId: null, role: null };
        }
    }

    HandleRefresh = async (data: any) => {
        try {
            console.log("Token refreshing...", data);
            const refreshtoken = data.token as string;
            const decoded: any = jwt.verify(refreshtoken, REFRESH_TOKEN_SECRET || "NO_KEY" as Secret);
            console.log("Token refreshed");5

            if (!decoded) {
                handleError(new Error("Invalid token decoding"));
                return { success: false };
            }

            const refreshToken = jwt.sign({ id: decoded.id, role: decoded.role }, REFRESH_TOKEN_SECRET || "NO_KEY" as Secret, {
                expiresIn: "7d"
            });

            const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, JWT_SECRET || "NO_KEY" as Secret, {
                expiresIn: "5m"
            });

            return { accessToken, refreshToken };
        } catch (e: any) {
            handleError(e); // Using handleError to log the error
            throw new Error("Something went wrong in token verification");
        }
    }
}
