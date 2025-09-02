export interface RefreshTokenRequest {
    refreshToken : string
}

export interface HandleRefreshResponse {
    success: boolean;
    message: string;
    accessToken?: string | undefined;
    refreshToken?: string | undefined;
}

export interface isAuthenticatedRequest {
    role: string;
    accessToken: string;
    refreshToken: string;
}
export interface isAuthenticatedResponse {
    success: boolean;
    message: string;
}
