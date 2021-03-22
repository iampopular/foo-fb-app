import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileHelperService {

  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();

  constructor(private fileuploadService: FileuploadService, private postService: PostService, private userService: UserService) { }

  updatePostPhotoId(userId, photoId): Observable<any> {
    return this.postService.updateBulkPosts({ userId: userId, photoId: photoId });
  }

  updateUserPhotoId(userId, photoId): Observable<any> {
    return this.userService.updateUserPhoto({ id: userId, photoId: photoId });
  }

  performPhotoUpdate(event): Observable<any>{
    return new Observable(observer => {
      if(event.target.files.length > 0){
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('picture',file);
        this.fileuploadService.uploadImage(formData).subscribe(uploadResult => {
          observer.next(uploadResult);
        });
      }
    });
  }
  changeActiveUserProfilePhoto(userId, event): Observable<any> {
    return new Observable(observer => {
      this.performPhotoUpdate(event).subscribe(uploadResult => {
        this.updateUserPhotoId(userId,uploadResult.uploadId).subscribe(()=>{
          this.updatePostPhotoId(userId,uploadResult.uploadId).subscribe(()=>{
            observer.next(uploadResult.uploadId);
            this.messageSource.next(true);
          });
        });
      });
    });
  }
}
