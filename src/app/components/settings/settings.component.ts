import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/app/components/base/base.component';
import { UserService } from 'src/app/services/user.service';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Params } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  providers: [DatePipe]
})
export class SettingsComponent extends BaseComponent implements OnInit {

  cities: string[] = ['Bhopal', 'Lucknow', 'Mumbai', 'Jaipur', 'Panji', 'Ranchi'];
  states: string[] = ['MP', 'UP', 'MH', 'RJ', 'GA', 'JK'];
  countries: string[] = ['India'];
  genders: String[] = ['Male', 'Female'];
  
  isLoading = true;
  profileForm: FormGroup;
  isProfileUpdateStart: boolean;
  activeUserObject: any;

  id: FormControl;
  firstName: FormControl;
  lastName: FormControl;
  dob: FormControl;
  gender: FormControl;
  phone: FormControl;
  country: FormControl;
  state: FormControl;
  city: FormControl;
  email: FormControl;
  pincode : FormControl;
  profession: FormControl;

  cPForm: FormGroup;
  isRPStart: boolean;
  existinUser: Params;

  cPid: FormControl;
  password: FormControl;
  confirmPassword: FormControl;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private datePipe: DatePipe, private toastService: ToastService) { 
    super();
    this.activeUserObject = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.userService.getUserById(this.activeUserObject._id).pipe(takeUntil(this.unsubscribe)).subscribe(currentUser => {
      if (currentUser !== null && currentUser !== undefined) {
        this.createUserForm(currentUser);
        this.createChangePasswordForm(currentUser);
        this.isLoading = false;
      }
    });
  }

  createChangePasswordForm(currentUser){
    this.cPid= new FormControl(currentUser.id);
    this.password = new FormControl("", Validators.compose([Validators.required, Validators.minLength(8)]));
    this.confirmPassword = new FormControl("", Validators.compose([Validators.required, Validators.minLength(8)]));

    this.isRPStart = false;
    this.cPForm = this.formBuilder.group(
      {
        'id': this.cPid,
        'password': this.password,
        'confirmPassword': this.confirmPassword
      }
    );
  }

  createUserForm(currentUser) {
    this.id= new FormControl(currentUser.id);
    this.firstName = new FormControl(currentUser.firstName, [Validators.required]);
    this.lastName = new FormControl(currentUser.lastName, [Validators.required]);
    this.dob = new FormControl({value: this.datePipe.transform(currentUser.dob, "yyyy-MM-dd"), disabled: true }, [Validators.required]);
    this.email = new FormControl({value: currentUser.email, disabled:true}, [Validators.required]);
    this.gender = new FormControl({value: currentUser.gender, disabled:true}, [Validators.required]);
    this.phone = new FormControl(currentUser.phone, [Validators.required]);
    this.country = new FormControl(currentUser.country, [Validators.required]);
    this.state = new FormControl(currentUser.state, [Validators.required]);
    this.city = new FormControl(currentUser.city, [Validators.required]);
    this.pincode = new FormControl(currentUser.pincode,[Validators.required]);
    this.profession = new FormControl(currentUser.profession,[Validators.required]);
    this.isProfileUpdateStart= false;
    this.profileForm = this.formBuilder.group(
      {
        'id': this.id,
        'firstName': this.firstName,
        'lastName': this.lastName,
        'dob': this.dob,
        'gender': this.gender,
        'phone': this.phone,
        'country': this.country,
        'state': this.state,
        'city': this.city,
        'email': this.email,
        'pincode': this.pincode,
        'profession': this.profession
      }
    );
  }

  onSubmit() {
    if(this.isProfileUpdateStart===false){
      this.isProfileUpdateStart=true;

      let detailsToUpdate = {
        id: this.profileForm.value.id,
        firstName: this.profileForm.value.firstName,
        lastName: this.profileForm.value.lastName,
        phone: this.profileForm.value.phone,
        city: this.profileForm.value.city,
        state: this.profileForm.value.state,
        country: this.profileForm.value.country,
        pincode: this.profileForm.value.pincode,
        profession: this.profileForm.value.profession
      };

      this.userService.updateUser(detailsToUpdate).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
        this.ngOnInit();
      });
    }
  }

  onCPSubmit(){
    if (this.isRPStart === false) {
      this.isRPStart = true;
      if (this.cPForm.value.password !== this.cPForm.value.confirmPassword) {
        this.toastService.showError("Password entered do not match!");
        this.isRPStart = false;
        return;
      }
      //console.log(this.cPForm.value);
      this.userService.updateUser(this.cPForm.value).pipe(takeUntil(this.unsubscribe)).subscribe();
      this.ngOnInit();

    }
  }

}
