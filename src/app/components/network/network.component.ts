import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UserService } from 'src/app/services/user.service';
import { UserHelperService } from 'src/app/utilities/user-helper.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.css']
})
export class NetworkComponent extends BaseComponent implements OnInit {

  networkUsers: User[] = [];
  activeUserObject: any;
  noUsers: Boolean = false;
  isLoading: Boolean = true;

  page: number;
  record: number = 10;
  previousPage: number = 1;
  nextPage: number = 1;
  pages: number;
  records: number;

  constructor(private userService: UserService, private userHelperService: UserHelperService, private route: ActivatedRoute) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.route
      .queryParams
      .subscribe(params => {
        this.page = +params['page'] || 1;
        this.isLoading = true;
        this.loadNetworks();
      });
  }

  private loadNetworks() {

    this.userService.getUsers().pipe(takeUntil(this.unsubscribe)).subscribe(allUsers => {
      if (allUsers.length <= 1) {
        this.isLoading = false;
        this.noUsers = true;
        return;
      }else{
        this.records = allUsers.length;
        this.pages = Math.ceil(this.records / this.record);
        const chunk = (arr, size) =>
          Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
          );
        var splitUsers = chunk(allUsers, this.record);
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

        console.log("splitUsers");
        console.log(splitUsers);
        this.userHelperService.createNetworkUserList(this.activeUserObject._id, splitUsers[this.page - 1]).pipe(takeUntil(this.unsubscribe)).subscribe(networkUsers => {
          console.log(networkUsers);
          this.isLoading = false;
          this.noUsers = networkUsers.length === 0 ? true : false;
          this.networkUsers = networkUsers;
        });
      }

    });
  }

  onRequestButtonClick(userClicked) {
    let friendRequestObject = {
      id: '',
      userId: this.activeUserObject._id,
      friendId: userClicked.id,
      status: 'Request Pending'
    }

    this.userHelperService.createNewFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

}
