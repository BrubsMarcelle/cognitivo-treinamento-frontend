import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { CheckinComponent } from './components/checkin/checkin.component';
import { Perfil } from './components/perfil/perfil';
import { Ranking } from './components/ranking/ranking';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { CreateUserComponent } from './components/create-user/create-user.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'checkin', component: CheckinComponent },
  { path: 'perfil', component: Perfil },
  { path: 'ranking', component: Ranking },
  { path: '**', redirectTo: '/login' }
];
