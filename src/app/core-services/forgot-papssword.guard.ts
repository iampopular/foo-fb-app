import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from 'src/app/services/authentication.service';

@Injectable()
export class ForgotPasswordGuard implements CanActivate {

    id : any;
    constructor(private router: Router, private authService: AuthenticationService) {
        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(route.queryParams.id);
        //console.log(" can activete "+this.id);
        if(route.queryParams.id===undefined || route.queryParams.id===""){
            this.router.navigate(['forgot-password']);
            return false
        }
        return true;
    }
}