import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { BaseComponent } from 'src/app/components/base/base.component';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
  providers: [DatePipe]
})
export class RegistrationComponent extends BaseComponent implements OnInit {

  signUpForm: FormGroup;
  isNewForm: Observable<boolean>;
  genders: String[] = ['Male', 'Female'];
  formDob: String;
  isSignUpStart: boolean;

  firstName: FormControl;
  lastName: FormControl;
  dob: FormControl;
  gender: FormControl;
  email: FormControl;
  password: FormControl;

  constructor(public formBuilder: FormBuilder, private datePipe: DatePipe, private userService: UserService, private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    this.formDob = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.firstName = new FormControl("", [Validators.required]);
    this.lastName = new FormControl("", [Validators.required]);
    this.dob = new FormControl(this.formDob, [Validators.required]);
    this.gender = new FormControl("", [Validators.required]);
    this.email = new FormControl("", Validators.compose([Validators.email, Validators.required]));
    this.password = new FormControl("", Validators.compose([Validators.required, Validators.minLength(8)]));
    this.isNewForm = observableOf(true);
    this.isSignUpStart = false;
    this.signUpForm = this.formBuilder.group(
      {
        'firstName': this.firstName,
        'lastName': this.lastName,
        'dob': this.dob,
        'gender': this.gender,
        'email': this.email,
        'password': this.password
      }
    );
  }

  onSubmit() {
    //console.log(this.signUpForm.value.email);
    if(this.isSignUpStart===false){
      this.isSignUpStart=true;

      this.userService.getUserByEmail(this.signUpForm.value.email)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(users => {
        console.log(users);
        if (users && users.length > 0) {
          this.toastService.showError("Email already exist!");
          this.isSignUpStart = false;
          return;
        }
        this.userService.register(this.signUpForm.value)
          .pipe(takeUntil(this.unsubscribe))
          .subscribe(() => {
            this.isSignUpStart = false;
            this.isNewForm = observableOf(false);
          });
      });
    }
  }

}
