import { Injectable } from '@angular/core';
import { Api } from './api';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private isOnlineSubject = new BehaviorSubject<boolean>(true);
  public isOnline$ = this.isOnlineSubject.asObservable();

  constructor(private apiService: Api) {
    this.checkConnection();

    // Verificar conexão a cada 30 segundos
    setInterval(() => {
      this.checkConnection();
    }, 30000);
  }

  private checkConnection(): void {
    this.apiService.healthCheck().subscribe({
      next: (response: any) => {
        const isOnline = response?.status !== 'offline';
        this.isOnlineSubject.next(isOnline);
      },
      error: () => {
        this.isOnlineSubject.next(false);
      }
    });
  }

  public forceCheck(): Observable<boolean> {
    this.checkConnection();
    return this.isOnline$;
  }
}
