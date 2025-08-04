export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api',
  USE_MOCK_API: true, // Set to false when backend is ready

  ENDPOINTS: {
    AUTH: {
      LOGIN: 'auth/login',
      REGISTER: 'auth/register',
      LOGOUT: 'auth/logout'
    },
    USER: {
      CREATE: 'users',
      RESET_PASSWORD: 'users/reset-password',
      PROFILE: 'users/me'
    },
    CHECKIN: {
      CREATE: 'checkins',
      LIST: 'checkins',
      STATUS: 'checkins/status',
      TODAY: 'checkins/today'
    },
    HEALTH: 'health'
  }
};
