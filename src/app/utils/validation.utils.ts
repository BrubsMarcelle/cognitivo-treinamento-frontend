export class ValidationUtils {

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    // Minimum 6 characters
    return Boolean(password) && password.length >= 6;
  }

  static isValidUsername(username: string): boolean {
    // Minimum 3 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
    return usernameRegex.test(username);
  }

  static sanitizeInput(input: string): string {
    return input.trim();
  }

  static isNotEmpty(value: string): boolean {
    return value !== null && value !== undefined && value.trim().length > 0;
  }
}
