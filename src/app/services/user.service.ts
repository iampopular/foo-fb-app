import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from 'src/app/models/user.model';
import { HeaderService } from 'src/app/services/header.service';
import { AppConfig } from 'src/app/config/app.config';
import { ToastService } from 'src/app/services/toast.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiBaseURL = AppConfig.settings.apiServer.baseURL;

  constructor(private http: HttpClient, private header: HeaderService, private toastService: ToastService) {

  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiBaseURL + 'users/').pipe(res => {
      return res;
    });
  }

  getUserById(userId: String): any {
    return this.http.get(this.apiBaseURL + 'users/' + userId).pipe(res => {
      return res;
    });
  };

  updateUserPhoto(updatedUser) {
    return this.http.post(this.apiBaseURL + 'users/updateuserphotoId', updatedUser, this.header.requestHeaders()).pipe(res => {
      return res;
    });
  };

  register(newUser: User) {
    return this.http.post<User>(this.apiBaseURL + 'users/register', newUser, this.header.requestHeaders())
      .pipe(res => {
        return res;
      });
  }

  getUserByEmail(email: String): any {
    return this.http.post(this.apiBaseURL + 'users/finduserbyemail', { email: email }, this.header.requestHeaders())
      .pipe(res => {
        return res;
      });
  };

  updateUser(updatedUser) {
    return this.http.put(this.apiBaseURL + 'users/' + updatedUser.id, updatedUser).pipe(res => {
      this.toastService.showSuccess('Details Updated Successfully');
      return res;
    });
  };
}
