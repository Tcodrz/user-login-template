import { AuthService, User, UserToken } from './../lib/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('f', { static: true }) loginRegisterForm: NgForm;

  formMode = true;        // true = register

  hasError: string = null;


  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }


  ngOnInit() {
    setTimeout(() => {
      // This is for later, so we don't have to enter user and pass every time
      this.loginRegisterForm.form.setValue({
        email: 'francis@gmail.com',
        password: 'testing123',
      });
    }, 1000);
  }

  toggleMode() {
    this.formMode = !this.formMode;
  }

  submitHandler() {

    const formValues = this.loginRegisterForm.value;

    if (this.loginRegisterForm.valid) {
      if (this.formMode === true) {
        // REGISTER
        this.authService.register(formValues)
          .subscribe(
            data => this.handleSuccess(data),
            error => this.handleError(error)
          );
      } else {
        // LOGIN
        this.authService.login(formValues)
          .subscribe(
            data => this.handleSuccess(data),
            error => this.handleError(error)
          );
      }
      this.loginRegisterForm.form.reset();

    }
  }

  handleSuccess(data: UserToken) {
    this.router.navigate(['./']);
    this.hasError = null;
  }

  handleError(error: string) {
    this.hasError = error;
  }

}
