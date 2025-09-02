export interface DecodedToken {
  id: string;
  role: string;
  iat?: number;
  exp?: number;
}