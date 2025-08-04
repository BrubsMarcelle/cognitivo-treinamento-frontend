import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss'
})
export class Perfil implements OnInit {
  user = {
    email: '',
    name: '',
    department: '',
    position: '',
    startDate: ''
  };

  stats = {
    totalCheckins: 0,
    totalPoints: 0,
    currentStreak: 0,
    longestStreak: 0
  };

  isEditing = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Verificar se está logado
    if (!localStorage.getItem('isLoggedIn')) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadUserData();
    this.loadStats();
  }

  loadUserData() {
    // Carregar dados do usuário (simulando API)
    this.user.email = localStorage.getItem('userEmail') || '';

    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      this.user = { ...this.user, ...profile };
    } else {
      // Dados padrão se não tiver perfil salvo
      this.user.name = 'Usuário';
      this.user.department = 'Tecnologia';
      this.user.position = 'Desenvolvedor';
      this.user.startDate = '2024-01-01';
    }
  }

  loadStats() {
    // Carregar estatísticas
    const checkins = JSON.parse(localStorage.getItem('checkins') || '[]');
    this.stats.totalCheckins = checkins.length;
    this.stats.totalPoints = parseInt(localStorage.getItem('userPoints') || '0');

    // Calcular streak atual e maior streak
    this.calculateStreaks(checkins);
  }

  calculateStreaks(checkins: any[]) {
    if (checkins.length === 0) return;

    // Ordenar checkins por data
    const sortedCheckins = checkins.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date();
    const lastCheckin = new Date(sortedCheckins[0].date);

    // Verificar streak atual
    if (this.isSameDate(today, lastCheckin) || this.isYesterday(today, lastCheckin)) {
      currentStreak = 1;

      for (let i = 1; i < sortedCheckins.length; i++) {
        const currentDate = new Date(sortedCheckins[i-1].date);
        const previousDate = new Date(sortedCheckins[i].date);

        if (this.isConsecutiveDay(currentDate, previousDate)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    // Calcular maior streak
    tempStreak = 1;
    for (let i = 1; i < sortedCheckins.length; i++) {
      const currentDate = new Date(sortedCheckins[i-1].date);
      const previousDate = new Date(sortedCheckins[i].date);

      if (this.isConsecutiveDay(currentDate, previousDate)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    this.stats.currentStreak = currentStreak;
    this.stats.longestStreak = Math.max(longestStreak, currentStreak);
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  private isYesterday(today: Date, date: Date): boolean {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toDateString() === date.toDateString();
  }

  private isConsecutiveDay(currentDate: Date, previousDate: Date): boolean {
    const nextDay = new Date(previousDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toDateString() === currentDate.toDateString();
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    // Salvar perfil no localStorage (simulando API)
    const profileToSave = {
      name: this.user.name,
      department: this.user.department,
      position: this.user.position,
      startDate: this.user.startDate
    };

    localStorage.setItem('userProfile', JSON.stringify(profileToSave));
    this.isEditing = false;
  }

  goBack() {
    this.router.navigate(['/checkin']);
  }

  navigateToRanking() {
    this.router.navigate(['/ranking']);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}
