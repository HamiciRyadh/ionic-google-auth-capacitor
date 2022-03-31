import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '@firebase/auth';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';

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
              private fb: FormBuilder,
              private toastController: ToastController) { }

  ngOnInit() {
    this.userService.getObservableUser().subscribe(user => {
      this.user = user;
      this.profileForm = this.fb.group({
        fullName: [this.user?.displayName ?? '', [Validators.required]],
        telephone: [this.user?.phoneNumber] ?? '',
      });
    });
  }

  public updateUser(): void {
    const name = this.profileForm.get('fullName').value;
    const phoneNumber = this.profileForm.get('telephone').value;
    this.userService.updateUser(this.user, name, phoneNumber)
      .then(value => {
        const msg = value ? 'Profile modifié avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());
      });
  }
}
