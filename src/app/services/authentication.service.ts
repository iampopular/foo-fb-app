import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { HeaderService } from 'src/app/services/header.service';
import { AppConfig } from 'src/app/config/app.config';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  isUserAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
  isUserAdmin = new BehaviorSubject<boolean>(this.hasAdmin());

  apiBaseURL = AppConfig.settings.apiServer.baseURL;

  constructor(private http: HttpClient, private header: HeaderService, private router: Router) { }

  private hasToken(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  isUserLoggedIn(): Observable<boolean> {
    return this.isUserAuthenticated.asObservable();
  }

  private hasAdmin(): boolean {
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser')).isAdmin;
    }
    return;
  }

  isAdmin(): Observable<boolean> {
    return this.isUserAdmin.asObservable();
  }

  getToken() {
    if (localStorage.getItem('currentUser')) {
      return JSON.parse(localStorage.getItem('currentUser')).token;
    }
    return;
  }

  getDecodedToken(token: string): any {
    try {
      return jwt_decode(token);
    }
    catch (Error) {
      return null;
    }
  }

  getTokenExpirationDate(token: string): Date {
    const decodedToken = this.getDecodedToken(token);
    if (decodedToken.exp === undefined) return null;
    const date = new Date(0);
    date.setUTCSeconds(decodedToken.exp);
    return date;
  }

  isTokenExpired(): boolean {
    var token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  login(email: string, password: string) {
    return this.http.post<any>(this.apiBaseURL + 'users/authenticate', { email: email, password: password })
      .pipe(
        map(user => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('currentUserPhotoId', user.photoId);
            this.isUserAuthenticated.next(true);
            this.isUserAdmin.next(user.isAdmin);
          }
          return user;
        })
      );
    /*this.http.post<any>(this.apiBaseURL + 'user/authenticate', { email: email, password: password })
    .pipe(res => {
      return res;
    });*/

  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.isUserAuthenticated.next(false);
    this.isUserAdmin.next(false);
    this.router.navigate(['/login']);
    //this.toastService.openSnackBar('You have been Logout Successfully!', '', 'success-snackbar');
  }
}
