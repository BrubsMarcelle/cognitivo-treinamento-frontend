export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    IS_LOGGED_IN: 'isLoggedIn',
    USER_EMAIL: 'userEmail',
    AUTH_TOKEN: 'authToken',
    CHECKIN_PREFIX: 'checkin_'
  },

  API_TIMEOUT: 10000,

  MESSAGES: {
    LOGIN_SUCCESS: 'Login realizado com sucesso!',
    LOGIN_ERROR: 'Erro ao fazer login. Verifique suas credenciais.',
    CHECKIN_SUCCESS: 'Check-in realizado com sucesso!',
    CHECKIN_ERROR: 'Erro ao realizar check-in.',
    WEEKEND_WARNING: 'Check-ins não são permitidos aos finais de semana.',
    ALREADY_CHECKED_IN: 'Você já fez o check-in hoje!',
    NETWORK_ERROR: 'Erro de conexão. Tente novamente.',
    CONGRATULATIONS: 'Parabéns, você já fez o check-in de hoje'
  },

  ROUTES: {
    LOGIN: '/login',
    CHECKIN: '/checkin',
    RANKING: '/ranking',
    PROFILE: '/perfil',
    CREATE_USER: '/create-user',
    RESET_PASSWORD: '/reset-password'
  }
} as const;
