import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service'; 
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isUserLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;

  constructor(public authenticationService: AuthenticationService) { 
    this.isAdmin = authenticationService.isAdmin();
    this.isUserLoggedIn = authenticationService.isUserLoggedIn();
  }

  onLogoutClick() {
    this.authenticationService.logout();
  }

  ngOnInit(): void {
  }

}
