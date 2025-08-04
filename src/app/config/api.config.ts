export const API_CONFIG = {
  // Configure aqui a URL do seu backend local
  BASE_URL: 'http://127.0.0.1:8002', // URL base sem barra final

  // Flag para alternar entre mock e API real
  USE_MOCK_API: false, // Mude para false quando quiser usar a API real

  // Endpoints da API baseados no OpenAPI
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/login', // POST - Login endpoint (novo formato)
      REGISTER: '/users', // POST - Create user
      RESET_PASSWORD: '/users/reset-password', // PUT - Reset password
      LOGOUT: '/auth/logout', // Não existe na API atual
      REFRESH: '/auth/refresh' // Não existe na API atual
    },
    USER: {
      PROFILE: '/user/profile', // Não existe na API atual
      UPDATE_PROFILE: '/user/profile', // Não existe na API atual
      RANKING: '/ranking/weekly' // GET - Get current weekly ranking
    },
    CHECKIN: {
      CREATE: '/checkin/', // POST - Create checkin (requer autenticação)
      STATUS: '/checkin/status' // GET - Check if user can checkin today
    },
    HEALTH: '/' // GET - Read root (health check)
  },

  // Configurações de timeout
  TIMEOUT: 10000, // 10 segundos

  // Configurações de retry
  RETRY_ATTEMPTS: 3
};
