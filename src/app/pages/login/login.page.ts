import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup ;

  constructor(private router: Router,
              private fb: FormBuilder,
              private userService: UserService,
              private activeRoute: ActivatedRoute) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    activeRoute.queryParams.subscribe(val => {
      if (val?.verifyEmail === 'true') {
        this.initLoginForm(...this.userService.getLoginCredentials());
      }
    });
  }

  ngOnInit() {}

  initLoginForm(email = '', password = ''): void {
    this.loginForm.controls.email.setValue(email);
    this.loginForm.controls.password.setValue(password);
  }

  loginWithEmailPassword(): void {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    this.userService.logIn(email, password)
      .then((isLoggedIn)=> {
        if (isLoggedIn) {
          // TODO: Clear all routing history.
          this.router.navigate(['/projects'], {replaceUrl: true})
            .then(()=> this.initLoginForm());
        }
      });
  }

  loginWithGoogle(): void {
    console.log('Login with Google');
  }

  loginWithGithub(): void {
    console.log('Login with Github');
  }

  redirectToPasswordRecovery(): void {
    this.router.navigate(['/password-recovery'])
      .then(() => this.initLoginForm());
  }

  redirectToRegister(): void {
    this.router.navigate(['/register'])
      .then(() => this.initLoginForm());
  }
}
