import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  public register():void {
    const fullName = this.registerForm.get('fullName').value;
    const email = this.registerForm.get('email').value;
    const telephone = this.registerForm.get('telephone').value;
    const password = this.registerForm.get('password').value;
    const confirmPassword = this.registerForm.get('confirmPassword').value;
    if(password === confirmPassword){
      this.userService.createAccount(fullName, email, telephone,password);
    }
  }

  redirectToLogin():void {
    this.router.navigate(['/login']).then(() => {});
  }
}
