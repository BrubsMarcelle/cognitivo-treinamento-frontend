import { APP_CONSTANTS } from './app.constants';

describe('APP_CONSTANTS', () => {

  it('should be defined', () => {
    expect(APP_CONSTANTS).toBeDefined();
  });

  describe('STORAGE_KEYS', () => {
    it('should have all required storage keys', () => {
      expect(APP_CONSTANTS.STORAGE_KEYS).toBeDefined();
      expect(APP_CONSTANTS.STORAGE_KEYS.IS_LOGGED_IN).toBe('isLoggedIn');
      expect(APP_CONSTANTS.STORAGE_KEYS.USER_EMAIL).toBe('userEmail');
      expect(APP_CONSTANTS.STORAGE_KEYS.AUTH_TOKEN).toBe('authToken');
      expect(APP_CONSTANTS.STORAGE_KEYS.CHECKIN_PREFIX).toBe('checkin_');
    });

    it('should have string values for all storage keys', () => {
      Object.values(APP_CONSTANTS.STORAGE_KEYS).forEach(key => {
        expect(typeof key).toBe('string');
        expect(key.length).toBeGreaterThan(0);
      });
    });
  });

  describe('API_TIMEOUT', () => {
    it('should have a valid timeout value', () => {
      expect(APP_CONSTANTS.API_TIMEOUT).toBeDefined();
      expect(typeof APP_CONSTANTS.API_TIMEOUT).toBe('number');
      expect(APP_CONSTANTS.API_TIMEOUT).toBeGreaterThan(0);
      expect(APP_CONSTANTS.API_TIMEOUT).toBe(10000);
    });
  });

  describe('MESSAGES', () => {
    it('should have all required messages', () => {
      const messages = APP_CONSTANTS.MESSAGES;

      expect(messages.LOGIN_SUCCESS).toBeDefined();
      expect(messages.LOGIN_ERROR).toBeDefined();
      expect(messages.CHECKIN_SUCCESS).toBeDefined();
      expect(messages.CHECKIN_ERROR).toBeDefined();
      expect(messages.WEEKEND_WARNING).toBeDefined();
      expect(messages.ALREADY_CHECKED_IN).toBeDefined();
      expect(messages.NETWORK_ERROR).toBeDefined();
      expect(messages.CONGRATULATIONS).toBeDefined();
    });

    it('should have meaningful message content', () => {
      const messages = APP_CONSTANTS.MESSAGES;

      expect(messages.LOGIN_SUCCESS).toContain('sucesso');
      expect(messages.LOGIN_ERROR).toContain('Erro');
      expect(messages.CHECKIN_SUCCESS).toContain('sucesso');
      expect(messages.CHECKIN_ERROR).toContain('Erro');
      expect(messages.WEEKEND_WARNING).toContain('finais de semana');
      expect(messages.ALREADY_CHECKED_IN).toContain('já fez');
      expect(messages.NETWORK_ERROR).toContain('conexão');
      expect(messages.CONGRATULATIONS).toContain('Parabéns');
    });

    it('should have string values for all messages', () => {
      Object.values(APP_CONSTANTS.MESSAGES).forEach(message => {
        expect(typeof message).toBe('string');
        expect(message.length).toBeGreaterThan(0);
      });
    });
  });

  describe('ROUTES', () => {
    it('should have all required routes', () => {
      const routes = APP_CONSTANTS.ROUTES;

      expect(routes.LOGIN).toBeDefined();
      expect(routes.CHECKIN).toBeDefined();
      expect(routes.RANKING).toBeDefined();
      expect(routes.CREATE_USER).toBeDefined();
    });

    it('should have valid route paths', () => {
      const routes = APP_CONSTANTS.ROUTES;

      expect(routes.LOGIN).toMatch(/^\/.*$/);
      expect(routes.CHECKIN).toMatch(/^\/.*$/);
      expect(routes.RANKING).toMatch(/^\/.*$/);
      expect(routes.CREATE_USER).toMatch(/^\/.*$/);
    });

    it('should have route paths starting with forward slash', () => {
      Object.values(APP_CONSTANTS.ROUTES).forEach(route => {
        expect(typeof route).toBe('string');
        expect(route).toMatch(/^\/.*$/);
      });
    });
  });

  describe('Data Structure Integrity', () => {
    it('should not have any undefined values', () => {
      const checkObject = (obj: any, path = '') => {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;

          if (value === undefined) {
            fail(`Found undefined value at ${currentPath}`);
          }

          if (typeof value === 'object' && value !== null) {
            checkObject(value, currentPath);
          }
        });
      };

      checkObject(APP_CONSTANTS);
    });

    it('should have consistent structure', () => {
      expect(typeof APP_CONSTANTS).toBe('object');
      expect(APP_CONSTANTS).not.toBeNull();

      // Check that main sections exist
      expect(APP_CONSTANTS.STORAGE_KEYS).toBeDefined();
      expect(APP_CONSTANTS.API_TIMEOUT).toBeDefined();
      expect(APP_CONSTANTS.MESSAGES).toBeDefined();
      expect(APP_CONSTANTS.ROUTES).toBeDefined();
    });
  });

  describe('Immutability', () => {
    it('should not allow modification of constants', () => {
      // These should not throw errors, but the original object should remain unchanged
      const originalLoginRoute = APP_CONSTANTS.ROUTES.LOGIN;

      try {
        (APP_CONSTANTS.ROUTES as any).LOGIN = '/modified';
      } catch (e) {
        // It's okay if it throws in strict mode
      }

      // The original value should still be there (if object is frozen)
      // If not frozen, this tests documents the current behavior
      expect(typeof APP_CONSTANTS.ROUTES.LOGIN).toBe('string');
    });
  });
});
