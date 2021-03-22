import { SUPER_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base/base.component';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { PostHelperService } from 'src/app/utilities/post-helper.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/app/models/post.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent extends BaseComponent implements OnInit {

  activeUserObject: any;
  existingPhotoId: String;
  postCreateForm: FormGroup;
  postCreateStart: boolean;
  postCreateValid: boolean = true;

  posts: Post[] = [];
  isLoading: Boolean = true;
  noPosts: Boolean;

  post : FormControl;
  postImage : FormControl;
  postImageSource : FormControl;
  userId : FormControl;
  userPhotoId : FormControl;
  userName : FormControl;
  isAdmin : FormControl;
  profession : FormControl;

  page : number;
  previousPage : number;
  nextPage : number;
 
  constructor(private formBuilder: FormBuilder, private fileuploadService: FileuploadService, private postHelperService: PostHelperService, private route: ActivatedRoute, private postService:PostService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {

    this.existingPhotoId = localStorage.getItem('currentUserPhotoId');
    this.createPostForm();
    
    this.route
      .queryParams
      .subscribe(params => {
        this.page = +params['page'] || 1;
        this.isLoading = true;
        this.loadPosts();
      });
  }

  private loadPosts() {

    this.postHelperService.page=this.page;
    this.postHelperService.record=5;

    this.isLoading = true;

    this.postHelperService.loadPosts(this.activeUserObject._id).pipe(takeUntil(this.unsubscribe)).subscribe(finalPosts => {
      this.noPosts = finalPosts.length <= 0 ? true : false;
      this.isLoading = false;
      this.posts = finalPosts;
      this.previousPage = this.postHelperService.previousPage;
      this.nextPage = this.postHelperService.nextPage;
    });
  }

  private createPostForm() {
    this.postCreateStart = false;
    this.post = new FormControl('',Validators.required);
    this.postImage = new FormControl('');
    this.postImageSource = new FormControl('');
    this.userId = new FormControl(this.activeUserObject._id);
    this.userPhotoId = new FormControl(this.existingPhotoId);
    this.userName = new FormControl(this.activeUserObject.firstName + ' ' + this.activeUserObject.lastName,);
    this.isAdmin = new FormControl(this.activeUserObject.isAdmin);
    this.profession = new FormControl(this.activeUserObject.profession);

    this.postCreateForm = this.formBuilder.group({
      'post': this.post,
      'postImage': this.postImage,
      'postImageSource': this.postImageSource,
      'userId': this.userId,
      'userPhotoId': this.userPhotoId,
      'userName': this.userName,
      'isAdmin': this.isAdmin,
      'profession': this.profession
    });
  }

  onFileChange(event){
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.postCreateForm.patchValue({
        postImageSource: file
      });
    }
  }

  onSubmit() {
    this.postCreateValid= this.postCreateForm.valid;
    if(this.postCreateForm.valid){
      if (this.postCreateStart === false) {
        this.postCreateStart = true;
        let fileData = this.postCreateForm.get('postImageSource').value;
        let formObject = {
          id: '',
          userId: this.postCreateForm.value.userId,
          userPhotoId: this.postCreateForm.value.userPhotoId,
          userName: this.postCreateForm.value.userName,
          isAdmin: this.postCreateForm.value.isAdmin,
          profession: this.postCreateForm.value.profession
        };
        this.postHelperService.uploadPostImage(formObject, fileData).subscribe(() => {
          this.ngOnInit();
        });
      }
    }
  }

  onHidePostClick(postToHide: Post) {
    postToHide.isActive = false;
    this.postService.updatePost(postToHide).subscribe(() => {
      this.loadPosts();
    });
  }

}
