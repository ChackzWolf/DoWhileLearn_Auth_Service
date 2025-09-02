import { refreshTokenRequest, roleBasedAuthRequest } from "../types/Auth-jwt.service.types"

export interface IAuthService {
    refreshToken (refreshtoken: string): Promise<refreshTokenRequest>
    roleBasedAuth(data:roleBasedAuthRequest): Promise<{success:boolean, message:string}>
}