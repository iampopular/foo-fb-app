import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ToastService } from 'src/app/services/toast.service';
import { AuthenticationService } from 'src/app/services/authentication.service'; 
import { first, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent implements OnInit {

  signInForm: FormGroup;
  isSignInStart: boolean;

  email: FormControl;
  password: FormControl;

  constructor(private toastService: ToastService,
    private router: Router, private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { 
    super();
  }

  ngOnInit(): void {

    this.email = new FormControl("", Validators.compose([Validators.email, Validators.required]));
    this.password = new FormControl("", Validators.compose([Validators.required, Validators.minLength(8)]));
    this.isSignInStart = false;
    this.signInForm = this.formBuilder.group(
      {
        'email': this.email,
        'password': this.password
      }
    );

  }

  onSubmit() {
    //console.log(this.signInForm.value);
    if(this.isSignInStart===false){
      this.isSignInStart=true;
      
      this.authenticationService.login(this.signInForm.value.email, this.signInForm.value.password)
      .pipe(first()).pipe(takeUntil(this.unsubscribe))
      .subscribe(loginResponse => {
        if (loginResponse && loginResponse.message) {
          this.toastService.showError(loginResponse.message);
          this.isSignInStart=false;
          return;
        }
        //console.log(loginResponse);
        this.router.navigate(['dashboard']);
      }, err => {
        console.log(err);
        this.toastService.showError('Invalid Credentials');
        this.isSignInStart=false;
      });
    }
  }

}
