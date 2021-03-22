import { Component, OnInit } from '@angular/core';

import { User } from 'src/app/models/user.model';
import { UserHelperService } from 'src/app/utilities/user-helper.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent extends BaseComponent implements OnInit {

  friends: User[] = [];
  activeUserObject: any;
  noFriends: Boolean;
  isLoading: Boolean = true;

  constructor(private userHelper: UserHelperService) {
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.userHelper.loadRequestingFriends(this.activeUserObject._id).pipe(takeUntil(this.unsubscribe)).subscribe(finalRequesters => {
      this.isLoading = false;
      this.noFriends = finalRequesters.length === 0 ? true : false;
      this.friends = finalRequesters;
    });
  }

  onAcceptButtonClick(frinedClicked) {
    let friendRequestObject = {
      id: frinedClicked.id,
      status: 'You are friend'
    }

    this.userHelper.updateFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

  onRejectButtonClick(frinedClicked) {
    let friendRequestObject = {
      id: frinedClicked.id,
      status: 'Request Rejected'
    }

    this.userHelper.updateFriendRequest(friendRequestObject).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });
  }

}
