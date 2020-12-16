import {Component, OnDestroy, OnInit} from '@angular/core';
import {Credentials} from "../../shared/models/user/credentials";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../reducers";

import * as LoginStore from '../../store';

import {LoginService} from "../login.service";
import {Observable} from "rxjs";
import {ElementState} from "../../shared/models/general/element-state";
import {takeWhile} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit ,OnDestroy{

  form: FormGroup;
  submit:Boolean=false;
  submitState$: Observable<ElementState>;
  alive = true;

  constructor(
    private store$: Store<AppState>,
    private loginService: LoginService
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6),Validators.maxLength(20)])
    });
  }

  ngOnInit() {
    this.submitState$ = this.store$
      .pipe(select(LoginStore.selectSubmit))
      .pipe(takeWhile(() => this.alive));
  }
// convenience getter for easy access to form fields
get f() { return this.form.controls; }
  onSubmit() {
    this.submit=true;
    if (this.form.invalid && this.submit) {
      return this.store$.dispatch(new LoginStore.LoginRequestFailure({
        success: false,
        message: 'Please enter a valid email and password',
        payload: {}
      }));
    }
    const credentials: Credentials = this.form.value;
    this.loginService.login(credentials);
  }

  
  ngOnDestroy(): void {
    this.alive = false;
  }
}
