import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { API_CONFIG } from '../config/api.config';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Adicionar token de autorização se existir
    const token = localStorage.getItem('authToken');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } else {
      authReq = req.clone({
        setHeaders: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Fazer chamada com retry em caso de erro
    return next.handle(authReq).pipe(
      retry(API_CONFIG.RETRY_ATTEMPTS),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);

        // Lidar com diferentes tipos de erro
        switch (error.status) {
          case 401:
            // Token expirado - redirecionar para login
            localStorage.removeItem('authToken');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isLoggedIn');
            window.location.href = '/login';
            break;
          case 403:
            console.error('Acesso negado');
            break;
          case 404:
            console.error('Recurso não encontrado');
            break;
          case 500:
            console.error('Erro interno do servidor');
            break;
          default:
            console.error('Erro desconhecido:', error.message);
        }

        return throwError(() => error);
      })
    );
  }
}
