import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/models/user.model';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css']
})
export class ActionComponent extends BaseComponent implements AgRendererComponent {

  private cellValue: string;
  isActive;
  user;
  params;

  constructor(private userService: UserService, private router: Router){
    super();
  }

  // gets called once before the renderer is used
  agInit(params: ICellRendererParams): void {
    this.isActive=params.data.isActive
    this.user=params.data;
    this.params=params;
  }

  // gets called whenever the user gets the cell to refresh
  refresh(params: ICellRendererParams): any {
    this.isActive=params.data.isActive;
    this.user=params.data;
    this.params=params;
    
  }

  onDisableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: false
    };

    this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      //this.ngOnInit();
      //this.refresh(this.params);
      //console.log(this.params);
      this.params.data.isActive=false;
      this.agInit(this.params);
    });
  }

  onEnableUserClick(userSelected: User) {
    let detailsToUpdate = {
      id: userSelected.id,
      isActive: true
    };
    this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      //this.ngOnInit();
      //this.refresh(this.params);
      //this.router.navigate(['users']);
      //console.log(this.params);
      this.params.data.isActive=true;
      this.agInit(this.params);
    });
  }



  

}
