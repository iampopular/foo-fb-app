import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import * as _ from 'underscore';
import { FileuploadService } from 'src/app/services/fileupload.service';
import { Post } from 'src/app/models/post.model';
import { PostService } from 'src/app/services/post.service'
import { UtilityService } from 'src/app/services/utility.service';


@Injectable({
    providedIn: 'root'
})
export class PostHelperService {


    page: number = 1;
    record: number = 10;
    records: number;
    pages: number;
    nextPage: number;
    previousPage: number;

    constructor(private fileuploadService: FileuploadService, private postService: PostService, private utilityService: UtilityService) { }

    calculatePostTimers(filteredPosts: any): Post[] {
        filteredPosts.forEach(element => {
            element.postTimer = this.utilityService.dateDifference(element.createdDate);
        });
        return filteredPosts.reverse();
    }

    loadPosts(userId): Observable<any> {
        return new Observable(observer => {
            this.postService.getAllPosts().subscribe(posts => {
                if (posts.length === 0) {
                    observer.next(posts);
                }

                let activePosts = _.filter(posts, function (post) { return post.isActive === true; });
                let aggregatePosts = this.calculatePostTimers(activePosts);

                this.records = aggregatePosts.length;
                this.pages = Math.ceil(this.records / this.record);
                const chunk = (arr, size) =>
                    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                        arr.slice(i * size, i * size + size)
                    );
                let splitPosts = chunk(aggregatePosts, this.record);
                if (this.page == this.pages) {
                    this.nextPage = 1;
                    this.previousPage = this.page - 1;
                } else {
                    this.nextPage = this.page + 1;
                    this.previousPage = this.page - 1;
                    if (this.page == 1) {
                        this.previousPage = this.pages;
                    }
                }

                //console.log(splitPosts[this.page-1]);
                this.loadUserIconForPosts(splitPosts[this.page - 1], userId).subscribe(mappedPosts => {
                    this.loadPostImages(mappedPosts).subscribe(finalPosts => {
                        //console.log(finalPosts);
                        observer.next(finalPosts);
                    });
                    //observer.next(mappedPosts);
                });
            });
        });
    }

    private loadUserIconForPosts(filteredPosts: any, userId: String): Observable<any> {
        return new Observable(observer => {
            filteredPosts.forEach(postElement => {
                postElement.isMyPost = postElement.userId === userId ? true : false;
                this.fileuploadService.getPhotoById(postElement.userPhotoId).subscribe(res => {
                    this.createImageFromBlob(res).subscribe(response => {
                        postElement.userIcon = response;
                        observer.next(filteredPosts);
                    })
                }, err => {
                    throw err;
                });
            });
        });
    }

    private createImageFromBlob(image: Blob): Observable<any> {
        return new Observable(observer => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
                let imageToShow = reader.result;
                observer.next(imageToShow);
            }, false);

            if (image) {
                reader.readAsDataURL(image);
            }
        })
    }

    private loadPostImages(mappedPosts: any): Observable<any> {
        return new Observable(observer => {
            mappedPosts.forEach(postElement => {
                if (postElement.postImageId) {
                    postElement.isPostImage = true;
                    this.fileuploadService.getPhotoById(postElement.postImageId).subscribe(res => {
                        this.createImageFromBlob(res).subscribe(response => {
                            postElement.postImage = response;
                            observer.next(mappedPosts);
                        });
                    });
                } else {
                    postElement.isPostImage = false;
                    observer.next(mappedPosts);
                }
            });
        });
    }

    createNewPost(formObject: Post, uploadId: string): Observable<any> {
        return new Observable(observer => {
            const postObject = {
                id: formObject.id,
                post: '',
                userId: formObject.userId,
                userName: formObject.userName,
                userPhotoId: formObject.userPhotoId,
                postImageId: uploadId,
                isActive: true,
                isAdmin: formObject.isAdmin,
                profession: formObject.profession
            };

            this.postService.createPost(postObject).subscribe(() => {
                observer.next();
            });
        });
    }

    performPictureUploading(fileData): Observable<any> {
        return new Observable(observer => {
            if (fileData) {
                const file = fileData;
                const formData = new FormData();
                formData.append('picture', file);
                this.fileuploadService.uploadImage(formData).subscribe(uploadResult => {
                    observer.next(uploadResult);
                });
            } else {
                observer.next(false);
            }
        });
    }
    uploadPostImage(formObject, fileData): Observable<any> {
        return new Observable(observer => {
            this.performPictureUploading(fileData).subscribe(uploadResult => {
                console.log(uploadResult);
                let uploadId = '';
                if (uploadResult != false)
                    uploadId = uploadResult.uploadId;
                this.createNewPost(formObject, uploadId).subscribe(() => {
                    observer.next(uploadResult);
                });
            });
        });
    }
}
