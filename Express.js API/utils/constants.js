module.exports = {
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    GATEWAY_TIMEOUT: 504,
  },
  
  TOKEN_EXPIRY: '1h',
  SALT_ROUNDS: 10,
  
  FILE_UPLOAD: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB
    ALLOWED_TYPES: /jpeg|jpg|png|gif/,
    UPLOAD_DIR: 'uploads/',
  },
  
  TIME_INTERVALS: {
    LAST_30_DAYS: '30 days',
    LAST_60_DAYS: '60 days',
  },
  
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100,
  },
};
