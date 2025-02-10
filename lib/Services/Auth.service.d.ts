export declare class AuthService {
    refreshToken(refreshtoken: any): Promise<{
        success: boolean;
        message: string;
        accessToken?: undefined;
        refreshToken?: undefined;
    } | {
        success: boolean;
        accessToken: string;
        refreshToken: string;
        message: string;
    }>;
    roleBasedAuth(data: {
        role: string;
        token: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
