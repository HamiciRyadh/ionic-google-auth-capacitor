import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup ;

  constructor(private router: Router,
              private fb: FormBuilder,) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  loginWithEmailPassword(): void {
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;
    console.log('TODO: Login with Email Password');
    console.log('email :',email);
    console.log('password :',password);
  }

  loginWithGoogle(): void {
    console.log('TODO: Login with Google');
  }

  loginWithGithub(): void {
    console.log('TODO: Login with Github');
  }

  redirectToPasswordRecovery(): void {
    this.router.navigate(['/password-recovery']).then(() => {});
  }

  redirectToRegister(): void {
    this.router.navigate(['/register']).then(() => {});
  }
}
