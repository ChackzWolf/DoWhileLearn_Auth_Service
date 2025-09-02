export interface refreshTokenRequest {success:boolean, message:string, accessToken?: string, refreshToken?: string}

export interface roleBasedAuthRequest {role:string,token:string}
export interface roleBasedAuthResponse{success:boolean, message:string}