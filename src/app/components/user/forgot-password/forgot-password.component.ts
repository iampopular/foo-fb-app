import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent extends BaseComponent implements OnInit {

  fPForm: FormGroup;
  isFPStart: boolean;
  email: FormControl;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastService: ToastService, private router: Router) {
    super();
  }

  ngOnInit(): void {

    this.email = new FormControl("", Validators.compose([Validators.email, Validators.required]));
    this.isFPStart = false;
    this.fPForm = this.formBuilder.group(
      {
        'email': this.email
      }
    );

  }

  onSubmit() {
    if (this.isFPStart === false) {
      this.isFPStart = true;

      this.userService.getUserByEmail(this.fPForm.value.email).pipe(takeUntil(this.unsubscribe)).subscribe(userFetched => {
        if (!userFetched || userFetched.length <= 0) {
          this.toastService.showError('Email does not exist!');
          this.isFPStart = false;
          return;
        }
  
        let existingUser = userFetched[0];
        this.isFPStart = false;
        console.log(existingUser);
        this.router.navigate(['reset-password'], { queryParams: { id: existingUser.id } });
      });

    }
  }

}
