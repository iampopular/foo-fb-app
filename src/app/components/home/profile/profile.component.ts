import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base/base.component';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { FriendService } from 'src/app/services/friend.service';
import { PostService } from 'src/app/services/post.service';
import { ProfileHelperService } from 'src/app/utilities/profile-helper.service';
import { ToastService } from 'src/app/services/toast.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends BaseComponent implements OnInit {

  activeUserObject: any;
  existingPhotoId: String;
  imageToShow: String | ArrayBuffer;
  isImageLoaded: Boolean = false;
  isImageAvailable: Boolean = false;
  noOfConnections: Number = 0;
  noOfPosts: Number = 0;

  constructor(private fileService: FileuploadService, private friendService: FriendService, private postService: PostService, private profileHelperService: ProfileHelperService, private toastService : ToastService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.existingPhotoId = localStorage.getItem('currentUserPhotoId');
    this.loadActiveUserPhoto(this.existingPhotoId);
    this.loadActiveUserConnections(this.activeUserObject._id);
    this.loadActiveUserPostCounts(this.activeUserObject._id);
  }

  loadActiveUserConnections(userId: String) {
    this.friendService.getAllFriendRequests().pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      //console.log(result);
      let matchingElement = _.filter(result, function (item) {
        return (item.userId === userId || item.friendId === userId) && item.status === 'You are friend';
      });

      this.noOfConnections = matchingElement.length;
    });
  }

  loadActiveUserPostCounts(userId: String) {
    this.postService.getPostByUserId(userId).pipe(takeUntil(this.unsubscribe)).subscribe(result => this.noOfPosts = result.length);
  }

  loadActiveUserPhoto(photoId: String) {
    this.fileService.getPhotoById(photoId).pipe(takeUntil(this.unsubscribe)).subscribe(result => {
      this.createImageFromBlob(result);
      this.isImageLoaded = true;
    }, err => {
      this.isImageLoaded = true;
      this.isImageAvailable = false;
    });
  }

  private createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      this.isImageAvailable = true;
      reader.readAsDataURL(image);
    }
  }

  onProfilePhotoUpload(event) {
    this.profileHelperService.changeActiveUserProfilePhoto(this.activeUserObject._id, event)
      .pipe(takeUntil(this.unsubscribe)).subscribe(newPhotoId => {
        localStorage.setItem('currentUserPhotoId', newPhotoId);
        this.toastService.showSuccess('Image Uploaded Successfully');
        this.ngOnInit();
      });
  }

}
