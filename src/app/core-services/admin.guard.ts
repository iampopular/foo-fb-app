import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let isAdmin = false;
        this.authService.isUserAdmin.subscribe(data => {
            isAdmin = data;
        });
        if(!isAdmin){
            this.router.navigate(['dashboard']);
            return false;
        }else{
            return true;
        }
    }
}