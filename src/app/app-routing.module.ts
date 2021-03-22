import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/components/home/dashboard/dashboard.component';
import { LoginComponent } from 'src/app/components/user/login/login.component';
import { RegistrationComponent } from 'src/app/components/user/registration/registration.component';
import { AuthGuard } from 'src/app/core-services/auth.guard';
import { LoginGuard } from 'src/app/core-services/login.guard';
import { UsersComponent } from 'src/app/components/users/users.component';
import { AdminGuard } from 'src/app/core-services/admin.guard';
import { ForgotPasswordComponent } from 'src/app/components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from 'src/app/components/user/reset-password/reset-password.component';
import { ForgotPasswordGuard } from 'src/app/core-services/forgot-papssword.guard';
import { SettingsComponent } from 'src/app/components/settings/settings.component';
import { NetworkComponent } from 'src/app/components/network/network.component';
import { FriendsComponent } from 'src/app/components/friends/friends.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'registration',
    component: RegistrationComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [ForgotPasswordGuard,LoginGuard]
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'network',
    component: NetworkComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'friends',
    component: FriendsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
