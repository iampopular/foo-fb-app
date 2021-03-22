import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConfig } from 'src/app/config/app.config';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/user/login/login.component';
import { RegistrationComponent } from './components/user/registration/registration.component';
import { BaseComponent } from './components/base/base.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './components/toast/toast.component';
import { DashboardComponent } from './components/home/dashboard/dashboard.component';
import { AuthGuard } from './core-services/auth.guard';
import { LoginGuard } from './core-services/login.guard';
import { ProfileComponent } from './components/home/profile/profile.component';
import { JwtInterceptor } from './core-services/jwt.interceptor';
import { UsersComponent } from './components/users/users.component';
import { AdminGuard } from './core-services/admin.guard';
import { PostsComponent } from './components/home/posts/posts.component';
import { LazyLoadImageModule, LAZYLOAD_IMAGE_HOOKS, ScrollHooks } from 'ng-lazyload-image'; // <-- include ScrollHooks
import { AgGridModule } from 'ag-grid-angular';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/user/reset-password/reset-password.component';
import { ForgotPasswordGuard } from './core-services/forgot-papssword.guard';
import { SettingsComponent } from './components/settings/settings.component';
import { NetworkComponent } from './components/network/network.component';
import { FriendsComponent } from './components/friends/friends.component';
import { ActionComponent } from './components/users/action/action.component';

export function initConfig(config: AppConfig) {
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegistrationComponent,
    BaseComponent,
    ToastComponent,
    DashboardComponent,
    ProfileComponent,
    UsersComponent,
    PostsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    SettingsComponent,
    NetworkComponent,
    FriendsComponent,
    ActionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    LazyLoadImageModule,
    AgGridModule.withComponents([])
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    },
    AuthGuard,
    LoginGuard,
    AdminGuard,
    ForgotPasswordGuard,
    AuthenticationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
