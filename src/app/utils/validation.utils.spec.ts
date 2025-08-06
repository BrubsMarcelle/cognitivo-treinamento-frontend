import { ValidationUtils } from './validation.utils';

describe('ValidationUtils', () => {

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'firstname.lastname@company.com.br',
        'test123@test-domain.com'
      ];

      validEmails.forEach(email => {
        expect(ValidationUtils.isValidEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid emails', () => {
      const invalidEmails = [
        '',
        'invalid',
        'invalid@',
        '@invalid.com',
        'invalid.com',
        'test@',
        '@test.com',
        'test @example.com'
      ];

      invalidEmails.forEach(email => {
        expect(ValidationUtils.isValidEmail(email)).toBe(false);
      });
    });

    it('should handle null and undefined values', () => {
      expect(ValidationUtils.isValidEmail(null as any)).toBe(false);
      expect(ValidationUtils.isValidEmail(undefined as any)).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid passwords', () => {
      const validPasswords = [
        '123456',
        'password',
        'strongPassword123',
        'P@ssw0rd!',
        'very_long_password_with_special_chars_123!@#'
      ];

      validPasswords.forEach(password => {
        expect(ValidationUtils.isValidPassword(password)).toBe(true);
      });
    });

    it('should return false for invalid passwords', () => {
      const invalidPasswords = [
        '',
        '12345',
        'abc',
        'a',
        'short'
      ];

      invalidPasswords.forEach(password => {
        expect(ValidationUtils.isValidPassword(password)).toBe(false);
      });
    });

    it('should handle null and undefined values', () => {
      expect(ValidationUtils.isValidPassword(null as any)).toBe(false);
      expect(ValidationUtils.isValidPassword(undefined as any)).toBe(false);
    });

    it('should return false for whitespace-only passwords', () => {
      expect(ValidationUtils.isValidPassword('      ')).toBe(true); // 6+ characters, even if spaces
      expect(ValidationUtils.isValidPassword('  ')).toBe(false); // Less than 6 characters
    });
  });

  describe('isValidUsername', () => {
    it('should return true for valid usernames', () => {
      const validUsernames = [
        'abc',
        'user123',
        'test_user',
        'USERNAME',
        'user_name_123',
        'a1b2c3',
        'longUsernameWithNumbers123'
      ];

      validUsernames.forEach(username => {
        expect(ValidationUtils.isValidUsername(username)).toBe(true);
      });
    });

    it('should return false for invalid usernames', () => {
      const invalidUsernames = [
        '',
        'ab', // Too short
        'user-name', // Contains hyphen
        'user name', // Contains space
        'user@name', // Contains special character
        'user.name', // Contains dot
        'user+name', // Contains plus
        'user#name', // Contains hash
        'user!name'  // Contains exclamation
      ];

      invalidUsernames.forEach(username => {
        expect(ValidationUtils.isValidUsername(username)).toBe(false);
      });
    });

    it('should handle null and undefined values', () => {
      expect(ValidationUtils.isValidUsername(null as any)).toBe(false);
      expect(ValidationUtils.isValidUsername(undefined as any)).toBe(false);
    });

    it('should require minimum 3 characters', () => {
      expect(ValidationUtils.isValidUsername('ab')).toBe(false);
      expect(ValidationUtils.isValidUsername('abc')).toBe(true);
    });

    it('should allow underscores but not other special characters', () => {
      expect(ValidationUtils.isValidUsername('user_name')).toBe(true);
      expect(ValidationUtils.isValidUsername('user-name')).toBe(false);
      expect(ValidationUtils.isValidUsername('user.name')).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim whitespace from input', () => {
      expect(ValidationUtils.sanitizeInput('  hello  ')).toBe('hello');
      expect(ValidationUtils.sanitizeInput('  test')).toBe('test');
      expect(ValidationUtils.sanitizeInput('test  ')).toBe('test');
      expect(ValidationUtils.sanitizeInput('   ')).toBe('');
    });

    it('should handle strings without extra whitespace', () => {
      expect(ValidationUtils.sanitizeInput('hello')).toBe('hello');
      expect(ValidationUtils.sanitizeInput('test123')).toBe('test123');
    });

    it('should preserve internal whitespace', () => {
      expect(ValidationUtils.sanitizeInput('  hello world  ')).toBe('hello world');
      expect(ValidationUtils.sanitizeInput('  first  second  ')).toBe('first  second');
    });

    it('should handle empty strings', () => {
      expect(ValidationUtils.sanitizeInput('')).toBe('');
    });

    it('should handle special characters', () => {
      expect(ValidationUtils.sanitizeInput('  test@example.com  ')).toBe('test@example.com');
      expect(ValidationUtils.sanitizeInput('  #hashtag!  ')).toBe('#hashtag!');
    });
  });

  describe('isNotEmpty', () => {
    it('should return true for non-empty strings', () => {
      expect(ValidationUtils.isNotEmpty('hello')).toBe(true);
      expect(ValidationUtils.isNotEmpty('test123')).toBe(true);
      expect(ValidationUtils.isNotEmpty('a')).toBe(true);
      expect(ValidationUtils.isNotEmpty('hello world')).toBe(true);
    });

    it('should return false for empty or whitespace-only strings', () => {
      expect(ValidationUtils.isNotEmpty('')).toBe(false);
      expect(ValidationUtils.isNotEmpty('   ')).toBe(false);
      expect(ValidationUtils.isNotEmpty('\t')).toBe(false);
      expect(ValidationUtils.isNotEmpty('\n')).toBe(false);
      expect(ValidationUtils.isNotEmpty(' \t \n ')).toBe(false);
    });

    it('should handle null and undefined values', () => {
      expect(ValidationUtils.isNotEmpty(null as any)).toBe(false);
      expect(ValidationUtils.isNotEmpty(undefined as any)).toBe(false);
    });

    it('should return true for strings with content even if they have leading/trailing spaces', () => {
      expect(ValidationUtils.isNotEmpty('  hello  ')).toBe(true);
      expect(ValidationUtils.isNotEmpty(' a ')).toBe(true);
    });

    it('should handle special characters', () => {
      expect(ValidationUtils.isNotEmpty('@')).toBe(true);
      expect(ValidationUtils.isNotEmpty('#hashtag')).toBe(true);
      expect(ValidationUtils.isNotEmpty('!')).toBe(true);
    });
  });
});
