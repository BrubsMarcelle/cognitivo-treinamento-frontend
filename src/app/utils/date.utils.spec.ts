import { DateUtils } from './date.utils';

describe('DateUtils', () => {

  describe('isWeekend', () => {
    it('should return true for Saturday', () => {
      // Create a Saturday date (Jan 6, 2024 is a Saturday)
      const saturday = new Date(2024, 0, 6); // Month is 0-indexed
      expect(DateUtils.isWeekend(saturday)).toBe(true);
    });

    it('should return true for Sunday', () => {
      // Create a Sunday date (Jan 7, 2024 is a Sunday)
      const sunday = new Date(2024, 0, 7);
      expect(DateUtils.isWeekend(sunday)).toBe(true);
    });

    it('should return false for weekdays', () => {
      // Test Monday through Friday (Jan 8-12, 2024)
      const monday = new Date(2024, 0, 8);
      const tuesday = new Date(2024, 0, 9);
      const wednesday = new Date(2024, 0, 10);
      const thursday = new Date(2024, 0, 11);
      const friday = new Date(2024, 0, 12);

      expect(DateUtils.isWeekend(monday)).toBe(false);
      expect(DateUtils.isWeekend(tuesday)).toBe(false);
      expect(DateUtils.isWeekend(wednesday)).toBe(false);
      expect(DateUtils.isWeekend(thursday)).toBe(false);
      expect(DateUtils.isWeekend(friday)).toBe(false);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same dates', () => {
      const date1 = new Date('2024-01-15T10:30:00');
      const date2 = new Date('2024-01-15T15:45:00');

      expect(DateUtils.isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different dates', () => {
      const date1 = new Date('2024-01-15T10:30:00');
      const date2 = new Date('2024-01-16T10:30:00');

      expect(DateUtils.isSameDay(date1, date2)).toBe(false);
    });

    it('should return true for identical dates', () => {
      const date1 = new Date('2024-01-15T10:30:00');
      const date2 = new Date('2024-01-15T10:30:00');

      expect(DateUtils.isSameDay(date1, date2)).toBe(true);
    });
  });

  describe('formatDate', () => {
    it('should format date in pt-BR format', () => {
      const date = new Date(2024, 0, 15); // Jan 15, 2024
      const formatted = DateUtils.formatDate(date);

      // The exact format might vary by environment, but should contain the date components
      expect(formatted).toContain('15');
      expect(formatted).toContain('01'); // January as 01
      expect(formatted).toContain('2024');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time in pt-BR format', () => {
      const date = new Date('2024-01-15T10:30:00');
      const formatted = DateUtils.formatDateTime(date);

      // Should contain both date and time components
      expect(formatted).toContain('15');
      expect(formatted).toContain('10');
      expect(formatted).toContain('30');
    });
  });

  describe('formatTime', () => {
    it('should format time with hours, minutes, and seconds', () => {
      const date = new Date('2024-01-15T10:30:45');
      const formatted = DateUtils.formatTime(date);

      expect(formatted).toContain('10');
      expect(formatted).toContain('30');
      expect(formatted).toContain('45');
    });
  });

  describe('getToday', () => {
    it('should return a Date object', () => {
      const today = DateUtils.getToday();
      expect(today).toBeInstanceOf(Date);
    });

    it('should return current date', () => {
      const today = DateUtils.getToday();
      const now = new Date();

      // Should be very close (within a few seconds)
      const timeDiff = Math.abs(today.getTime() - now.getTime());
      expect(timeDiff).toBeLessThan(5000); // Less than 5 seconds
    });
  });

  describe('getTodayString', () => {
    it('should return today as string', () => {
      const todayString = DateUtils.getTodayString();
      const expected = new Date().toDateString();

      expect(todayString).toBe(expected);
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      const today = new Date();
      expect(DateUtils.isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(DateUtils.isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(DateUtils.isToday(tomorrow)).toBe(false);
    });
  });

  describe('getDayName', () => {
    it('should return correct day names in Portuguese', () => {
      const sunday = new Date(2024, 0, 7); // Jan 7, 2024 is Sunday
      const monday = new Date(2024, 0, 8); // Jan 8, 2024 is Monday
      const saturday = new Date(2024, 0, 6); // Jan 6, 2024 is Saturday

      expect(DateUtils.getDayName(sunday)).toBe('Domingo');
      expect(DateUtils.getDayName(monday)).toBe('Segunda');
      expect(DateUtils.getDayName(saturday)).toBe('Sábado');
    });

    it('should return all day names correctly', () => {
      const dates = [
        new Date(2024, 0, 7), // Sunday
        new Date(2024, 0, 8), // Monday
        new Date(2024, 0, 9), // Tuesday
        new Date(2024, 0, 10), // Wednesday
        new Date(2024, 0, 11), // Thursday
        new Date(2024, 0, 12), // Friday
        new Date(2024, 0, 6)  // Saturday
      ];

      const expectedNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

      dates.forEach((date, index) => {
        expect(DateUtils.getDayName(date)).toBe(expectedNames[index]);
      });
    });
  });

  describe('getMonthName', () => {
    it('should return correct month names in Portuguese', () => {
      const january = new Date('2024-01-15');
      const december = new Date('2024-12-15');
      const june = new Date('2024-06-15');

      expect(DateUtils.getMonthName(january)).toBe('Janeiro');
      expect(DateUtils.getMonthName(december)).toBe('Dezembro');
      expect(DateUtils.getMonthName(june)).toBe('Junho');
    });

    it('should return all month names correctly', () => {
      const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
      ];

      months.forEach((monthName, index) => {
        const date = new Date(2024, index, 15); // Month is 0-indexed
        expect(DateUtils.getMonthName(date)).toBe(monthName);
      });
    });
  });

  describe('getTodayLabel', () => {
    it('should return formatted today label', () => {
      const todayLabel = DateUtils.getTodayLabel();

      // Should contain day name and formatted date
      expect(typeof todayLabel).toBe('string');
      expect(todayLabel).toContain(',');

      // Check if it contains a valid Portuguese day name
      const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const containsDayName = dayNames.some(day => todayLabel.includes(day));
      expect(containsDayName).toBe(true);
    });

    it('should match expected format', () => {
      const todayLabel = DateUtils.getTodayLabel();

      // Should be in format "DayName, formatted_date"
      expect(todayLabel).toMatch(/^(Domingo|Segunda|Terça|Quarta|Quinta|Sexta|Sábado), /);
    });
  });
});
