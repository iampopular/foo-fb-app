import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';
import { BaseComponent } from 'src/app/components/base/base.component';
import * as _ from 'underscore';
import { User } from 'src/app/models/user.model';
import { ActionComponent } from 'src/app/components/users/action/action.component'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends BaseComponent implements OnInit {

  frameworkComponents;
  columnDefs;

  rowData: Array<User>;
  constructor(private userService: UserService, private toastService: ToastService) {
    super();
    this.frameworkComponents = {
      actionCellRenderer: ActionComponent,
    };
    this.columnDefs = [
      {
        headerName: 'Name',
        colId: 'name',
        valueGetter: this.nameValueGetter, sortable: true, filter: true
      },
      { field: 'city', headerName: 'City', sortable: true, filter: true },
      { field: 'phone', headerName: 'Phone', sortable: true, filter: true },
      { field: 'email', headerName: 'Email', sortable: true, filter: true },
      { field: 'profession', headerName: 'Profession', sortable: true, filter: true },
      {
        headerName: 'Actions',
        colID: 'action',
        cellRenderer: 'actionCellRenderer',
      }
    ];

  
  }

  nameValueGetter(params) {
    return params.data.firstName + " " + params.data.lastName;
  }

  actionValueGetter(params) {

    if (params.data.isActive) {
      let doActiveButton = '<button type="button" class="btn btn-sm btn-success" (click)="onDisableUserClick()">Active</button>';
      return doActiveButton;
    } else {
      let doBlockButton = '<button type="button" class="btn btn-sm btn-danger" (click)="onEnableUserClick()">Blocked</button>';
      return doBlockButton;
    }
  }

  onDisableUserClick() {
    console.log("onDisableUserClick");

    /*let detailsToUpdate = {
      id: userSelected.id,
      isActive: false
    };

    this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });*/
  }

  onEnableUserClick() {
    console.log("onEnableUserClick");
    /*let detailsToUpdate = {
      id: userSelected.id,
      isActive: true
    };
    this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.ngOnInit();
    });*/
  }

  ngOnInit(): void {
    this.userService.getUsers()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
        users = _.filter(users, function (user) { return user.isAdmin !== true });
        this.rowData = users;
        console.log(users);
      },
        err => {
          this.toastService.showError('Data Loading Error: ' + err.status + ' - ' + err.statusText);
        });
  }

}
