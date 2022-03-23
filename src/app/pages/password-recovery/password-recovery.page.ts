import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
})
export class PasswordRecoveryPage implements OnInit {
  passwordRecoveryForm: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private userService: UserService) { }

  ngOnInit() {
    this.passwordRecoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  recoverPassword(): void {
    const email = this.passwordRecoveryForm.get('email').value;
    this.userService.recoverPassword(email);
  }

  redirectToLogin(): void{
    this.router.navigate(['/login']).then(() => {});
  }
}
