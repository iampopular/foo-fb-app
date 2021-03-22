import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AppConfig } from 'src/app/config/app.config';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {

  apiBaseURL = AppConfig.settings.apiServer.baseURL;

  constructor(private http: HttpClient) { }

  uploadImage(formData: FormData) {
    return this.http.post<any>(this.apiBaseURL + 'files/uploadfile', formData).pipe(res => {
      return res;
    });
  }

  getPhotoById(photoId: String) {
    return this.http.get(this.apiBaseURL + 'files/' + photoId, { responseType: "blob" }).pipe(res => {
      return res;
    });
  }
}
