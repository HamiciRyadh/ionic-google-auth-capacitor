import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '@firebase/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  user: User;

  constructor(private userService: UserService,
              private router: Router,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.user = this.userService.getUser();
    this.profileForm = this.fb.group({
      fullName: [this.user.displayName, [Validators.required]],
      telephone: [this.user.phoneNumber],
    });
  }

  public updateUser(): void {
    const fullName = this.profileForm.get('fullName').value;
    const telephone = this.profileForm.get('telephone').value;
    // this.user.name = fullName;
    // this.user.phoneNumber = telephone;
    // this.userService.updateUser(this.user);
    this.redirectToHome();
  }

  public redirectToHome(): void {
    this.router.navigate(['/home']).then(() => {});
  }

}
