import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.getToken() && !this.authService.isTokenExpired()) {
            this.router.navigate(['dashboard']);
            return false;
        }  else {
            return true;
        }
    }
}