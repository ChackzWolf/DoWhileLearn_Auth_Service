import dotenv from 'dotenv'
dotenv.config()


export const configs = {
  AUTH_GRPC_PORT: process.env.AUTH_GRPC_PORT || "5005",

  // JWT CONFIGS
  JWT_SECRET: process.env.JWT_SECRET || "NO_KEY",
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || "NO_KEY",
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME || "1m",
  REFRESH_TOKEN_EXPIRATION_TIME: process.env.REFRESH_TOKEN_EXPIRATION_TIME || "10d",

  // LOGGER CONFIGS
  LOG_RETENTION_DAYS: process.env.LOG_RETENTION_DAYS || "7d",
} as const;  
