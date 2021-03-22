import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Params, Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent extends BaseComponent implements OnInit {

  rPForm: FormGroup;
  isRPForm: Observable<boolean>;
  isRPStart: boolean;
  existinUser: Params;

  id: FormControl;
  password: FormControl;
  confirmPassword: FormControl;

  constructor(public formBuilder: FormBuilder, private toastService: ToastService, private userService: UserService,  private router:Router) {
    super();
    this.existinUser = this.router.getCurrentNavigation().extras.queryParams;
  }

  ngOnInit(): void {
    this.id = new FormControl(this.existinUser.id);
    this.password = new FormControl("", Validators.compose([Validators.required, Validators.minLength(8)]));
    this.confirmPassword = new FormControl("", Validators.compose([Validators.required, Validators.minLength(8)]));
    this.isRPForm = observableOf(true);
    this.isRPStart = false;
    this.rPForm = this.formBuilder.group(
      {
        'id': this.id,
        'password': this.password,
        'confirmPassword': this.confirmPassword
      }
    );

  }

  onSubmit() {
    //console.log(this.signUpForm.value.email);
    if (this.isRPStart === false) {
      this.isRPStart = true;
      if (this.rPForm.value.password !== this.rPForm.value.confirmPassword) {
        this.toastService.showError("Password entered do not match!");
        this.isRPStart = false;
        return;
      }
      console.log(this.rPForm.value);
      this.userService.updateUser(this.rPForm.value).pipe(takeUntil(this.unsubscribe)).subscribe();
      this.isRPForm = observableOf(false);

    }
  }

}
