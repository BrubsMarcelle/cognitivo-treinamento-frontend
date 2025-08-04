export class DateUtils {

  static isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // 0 = Sunday, 6 = Saturday
  }

  static isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  static formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }

  static formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR');
  }

  static formatTime(date: Date): string {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  static getToday(): Date {
    return new Date();
  }

  static getTodayString(): string {
    return this.getToday().toDateString();
  }

  static isToday(date: Date): boolean {
    return this.isSameDay(date, this.getToday());
  }

  static getDayName(date: Date): string {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[date.getDay()];
  }

  static getMonthName(date: Date): string {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[date.getMonth()];
  }

  static getTodayLabel(): string {
    const today = this.getToday();
    const dayName = this.getDayName(today);
    const formattedDate = this.formatDate(today);
    return `${dayName}, ${formattedDate}`;
  }
}
