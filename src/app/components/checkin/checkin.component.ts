import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { User } from '../../models/user.model';
import { CheckinStatusResponse } from '../../models/checkin.model';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { DateUtils } from '../../utils/date.utils';

@Component({
  selector: 'app-checkin',
  imports: [CommonModule],
  templateUrl: './checkin.html',
  styleUrl: './checkin.scss'
})
export class CheckinComponent implements OnInit, OnDestroy {
  // Time properties
  currentTime: Date = new Date();
  private destroy$ = new Subject<void>();

  // User properties
  userEmail: string = '';

  // Checkin state
  canCheckIn: boolean = true;
  isLoading: boolean = false;
  checkinSuccess: boolean = false;
  checkinError: string | null = null;
  checkinMessage: string = '';
  lastCheckin: Date | null = null;
  checkins: any[] = [];

  // Ranking properties
  weeklyRanking: User[] = []; // Para o pódio (3 primeiros)
  fullRanking: User[] = []; // Para a tabela (todos os usuários)
  isLoadingRanking: boolean = false;

  constructor(
    private api: Api,
    private authService: AuthService,
    private storageService: StorageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const isAuth = this.authService.isAuthenticated();

    if (!isAuth) {
      console.log('❌ Usuário não autenticado, redirecionando para login');
      this.authService.redirectToLogin();
      return;
    }

    console.log('✅ Usuário autenticado, iniciando checkin');
    this.userEmail = localStorage.getItem('userEmail') || '';
    this.updateTime();
    this.startTimeUpdater();
    this.cleanOldCheckins();
    this.loadCheckinStatus();
    this.loadRanking();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Time management
  private startTimeUpdater(): void {
    interval(1000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateTime();
      });
  }

  private updateTime(): void {
    this.currentTime = new Date();
  }

  private cleanOldCheckins(): void {
    this.storageService.cleanOldCheckins();
  }

  private loadCheckinStatus(): void {
    this.api.getCheckinStatus().subscribe({
      next: (status: CheckinStatusResponse) => {
        this.handleCheckinStatus(status);
        this.loadCheckinHistory();
      },
      error: (error) => {
        this.loadCheckinsFromLocalStorage();
      }
    });
  }

  private handleCheckinStatus(status: CheckinStatusResponse): void {
    this.canCheckIn = status.can_checkin ?? true;

    if (!this.canCheckIn) {
      if (status.already_checked_in) {
        this.checkinMessage = `${APP_CONSTANTS.MESSAGES.CONGRATULATIONS} (${status.today})`;
      } else if (status.is_weekend) {
        this.checkinMessage = status.message || '';
      } else {
        this.checkinMessage = status.reason || '';
      }
    } else {
      this.checkinMessage = '';
    }
  }

  private loadCheckinsFromLocalStorage(): void {
    const today = DateUtils.getToday();
    const hasCheckedIn = this.storageService.hasCheckinForDate(today);

    if (hasCheckedIn) {
      const checkinData = this.storageService.getCheckinForDate(today);

      this.canCheckIn = false;
      this.lastCheckin = new Date(checkinData.timestamp);
      this.checkinMessage = `${APP_CONSTANTS.MESSAGES.CONGRATULATIONS} (${DateUtils.formatDate(today)})`;
    } else {
      this.canCheckIn = !DateUtils.isWeekend(today);
      this.lastCheckin = null;
      this.checkinMessage = DateUtils.isWeekend(today) ? APP_CONSTANTS.MESSAGES.WEEKEND_WARNING : '';
    }
  }

  private loadCheckinHistory(): void {
    this.api.getCheckins().subscribe({
      next: (checkins) => {

        // Verificação de segurança - garantir que seja um array
        if (Array.isArray(checkins)) {
          this.checkins = checkins;
        } else {
          console.log('⚠️ ERRO DEBUG - Checkins não é array, mantendo array vazio');
          this.checkins = [];
        }
      },
      error: (error) => {
        console.error('❌ Erro ao carregar histórico:', error);
        this.checkins = [];
      }
    });
  }

  private loadRanking(): void {
    this.isLoadingRanking = true;

    this.api.getRanking().subscribe({
      next: (ranking: User[]) => {

        this.weeklyRanking = ranking.slice(0, 3);

        this.fullRanking = ranking;

        this.isLoadingRanking = false;

        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('❌ TESTE DEBUG - Erro ao carregar ranking:', error);
        this.weeklyRanking = [];
        this.fullRanking = [];
        this.isLoadingRanking = false;
        this.cdr.detectChanges();
      }
    });
  }

  doCheckin(): void {
    if (!this.canCheckIn || this.isLoading) {
      return;
    }

    const now = new Date();
    this.isLoading = true;

      const checkinData = {
        userId: 1, // Mock user ID
        timestamp: now.toISOString()
      };

    this.api.doCheckin(checkinData).subscribe({
      next: (response) => {
        this.handleCheckinSuccess(response);
      },
      error: (error) => {
        console.error('❌ Erro ao fazer checkin:', error);
        this.handleCheckinError(error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  private handleCheckinSuccess(response: any): void {
    this.checkinSuccess = true;
    this.canCheckIn = false;

    // Verificar se o timestamp é válido
    let validTimestamp: Date;
    if (response.timestamp) {
      try {
        validTimestamp = new Date(response.timestamp);
        if (isNaN(validTimestamp.getTime())) {
          throw new Error('Invalid timestamp');
        }
      } catch (error) {
        console.log('⚠️ ERRO DEBUG - Timestamp inválido, usando data atual:', response.timestamp);
        validTimestamp = new Date();
      }
    } else {
      validTimestamp = new Date();
    }

    this.lastCheckin = validTimestamp;
    this.checkinMessage = `${APP_CONSTANTS.MESSAGES.CONGRATULATIONS} (${DateUtils.formatDate(new Date())})`;

    // Add to checkins list (com verificação de segurança)
    if (!Array.isArray(this.checkins)) {
      console.log('⚠️ ERRO DEBUG - checkins não é array, reinicializando:', typeof this.checkins);
      this.checkins = [];
    }
    this.checkins.unshift(response);

    // Save to localStorage as backup
    const today = DateUtils.getToday();
    this.storageService.setItem(`checkin_${DateUtils.formatDate(today)}`, JSON.stringify({
      timestamp: validTimestamp.toISOString(),
      userId: 1,
      points: response.points || 10
    }));

    setTimeout(() => {
      this.loadRanking();
    }, 1000);

    setTimeout(() => {
      this.checkinSuccess = false;
    }, 3000);
  }

  private handleCheckinError(error: any): void {
    const now = new Date();
    const today = DateUtils.getToday();

    const fallbackCheckin = {
      timestamp: now.toISOString(),
      userId: 1,
      points: 10,
      offline: true
    };

    this.storageService.setItem(`checkin_${DateUtils.formatDate(today)}`, JSON.stringify(fallbackCheckin));

    this.checkinSuccess = true;
    this.canCheckIn = false;
    this.lastCheckin = now;
    this.checkinMessage = `${APP_CONSTANTS.MESSAGES.CONGRATULATIONS} (Offline)`;

    setTimeout(() => {
      this.checkinSuccess = false;
    }, 3000);
  }

  resetTodayCheckin(): void {
    const today = DateUtils.getToday();
    const todayKey = `checkin_${DateUtils.formatDate(today)}`;

    if (this.storageService.getItem(todayKey)) {
      this.storageService.removeItem(todayKey);

      this.canCheckIn = !DateUtils.isWeekend(today);
      this.checkinSuccess = false;
      this.lastCheckin = null;
      this.checkinMessage = DateUtils.isWeekend(today) ? APP_CONSTANTS.MESSAGES.WEEKEND_WARNING : '';
      this.checkins = [];
    }
  }

  logout(): void {
    this.authService.logout();
  }

  get formattedTime(): string {
    return DateUtils.formatTime(this.currentTime);
  }

  get formattedDate(): string {
    return DateUtils.formatDate(this.currentTime);
  }

  get todayLabel(): string {
    return DateUtils.getTodayLabel();
  }

  get isWeekend(): boolean {
    return DateUtils.isWeekend(this.currentTime);
  }

  get canShowCheckinButton(): boolean {
    return this.canCheckIn && !this.isLoading && !this.isWeekend;
  }

  get checkinButtonText(): string {
    if (this.isLoading) {
      return 'Fazendo check-in...';
    }
    if (this.isWeekend) {
      return 'Fim de semana';
    }
    if (!this.canCheckIn) {
      return 'Check-in já realizado';
    }
    return 'Fazer Check-in';
  }

  get statusClass(): string {
    if (this.checkinSuccess) return 'success';
    if (this.isWeekend) return 'weekend';
    if (!this.canCheckIn) return 'completed';
    return 'pending';
  }

  trackByUserId(index: number, user: User): any {
    return user.id || user.name || index;
  }
}
