module.exports = {
  SUCCESS: {
    OK: 'Request successful',
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
  },

  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Unauthorized access',
    TOKEN_MISSING: 'Authentication token is missing',
    TOKEN_INVALID: 'Authentication token is invalid',
    TOKEN_EXPIRED: 'Authentication token has expired',
  },

  VALIDATION: {
    REQUIRED_FIELDS: 'Required fields are missing',
    INVALID_INPUT: 'Invalid input provided',
    EMAIL_EXISTS: 'Email already exists',
  },

  NOT_FOUND: {
    RESOURCE: 'Requested resource not found',
    USER: 'User not found',
  },

  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  },
};
