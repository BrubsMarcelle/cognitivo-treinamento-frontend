import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Api, User } from '../../services/api';

interface RankingUser {
  id: number;
  name: string;
  email: string;
  points: number;
  checkins: number;
  streak: number;
  position: number;
}

@Component({
  selector: 'app-ranking',
  imports: [CommonModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.scss'
})
export class Ranking implements OnInit {
  users: RankingUser[] = [];
  currentUser: RankingUser | null = null;
  currentUserEmail = '';
  isLoading = false;
  error: string | null = null;

  constructor(private router: Router, private api: Api) {}

  ngOnInit() {
    if (!localStorage.getItem('isLoggedIn')) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUserEmail = localStorage.getItem('userEmail') || '';
    this.loadRanking();
  }

  loadRanking() {
    this.isLoading = true;
    this.error = null;

    this.api.getRanking().subscribe({
      next: (ranking: User[]) => {
        this.users = ranking.map((user, index) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          points: user.totalPoints,
          checkins: user.totalCheckins,
          streak: user.currentStreak,
          position: index + 1
        }));

        this.currentUser = this.users.find(user => user.email === this.currentUserEmail) || null;

        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar ranking:', error);
        this.error = 'Erro ao carregar o ranking. Carregando dados de exemplo...';
        this.isLoading = false;

        this.generateMockRanking();
      }
    });
  }

  generateMockRanking() {
    // Dados simulados para o ranking (em uma aplicação real, viriam da API)
    const mockUsers = [
      { name: 'Ana Silva', email: 'ana.silva@empresa.com', points: 450, checkins: 45, streak: 12 },
      { name: 'Carlos Santos', email: 'carlos.santos@empresa.com', points: 380, checkins: 38, streak: 8 },
      { name: 'Maria Oliveira', email: 'maria.oliveira@empresa.com', points: 320, checkins: 32, streak: 15 },
      { name: 'João Pereira', email: 'joao.pereira@empresa.com', points: 290, checkins: 29, streak: 6 },
      { name: 'Fernanda Costa', email: 'fernanda.costa@empresa.com', points: 250, checkins: 25, streak: 9 },
      { name: 'Ricardo Lima', email: 'ricardo.lima@empresa.com', points: 230, checkins: 23, streak: 4 },
      { name: 'Juliana Rocha', email: 'juliana.rocha@empresa.com', points: 180, checkins: 18, streak: 7 },
      { name: 'Pedro Alves', email: 'pedro.alves@empresa.com', points: 150, checkins: 15, streak: 3 },
    ];

    const currentUserProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    const currentUserPoints = parseInt(localStorage.getItem('userPoints') || '0');
    const currentUserCheckins = JSON.parse(localStorage.getItem('checkins') || '[]').length;

    const currentUserData = {
      name: currentUserProfile.name || 'Você',
      email: this.currentUserEmail,
      points: currentUserPoints,
      checkins: currentUserCheckins,
      streak: this.calculateCurrentUserStreak()
    };

    const existingUserIndex = mockUsers.findIndex(user => user.email === this.currentUserEmail);
    if (existingUserIndex === -1) {
      mockUsers.push(currentUserData);
    } else {
      mockUsers[existingUserIndex] = currentUserData;
    }

    const sortedUsers = mockUsers
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({
        id: index + 1,
        ...user,
        position: index + 1
      }));

    this.users = sortedUsers;
    this.currentUser = sortedUsers.find(user => user.email === this.currentUserEmail) || null;
  }

  calculateCurrentUserStreak(): number {
    const checkins = JSON.parse(localStorage.getItem('checkins') || '[]');
    if (checkins.length === 0) return 0;

    const sortedCheckins = checkins.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < sortedCheckins.length; i++) {
      const checkinDate = new Date(sortedCheckins[i].date);
      const daysDiff = Math.floor((today.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  getMedalIcon(position: number): string {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${position}º`;
    }
  }

  getPositionClass(position: number): string {
    switch (position) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return 'regular';
    }
  }

  isCurrentUser(email: string): boolean {
    return email === this.currentUserEmail;
  }

  trackByUser(index: number, user: RankingUser): number {
    return user.id;
  }

  goBack() {
    this.router.navigate(['/checkin']);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}
