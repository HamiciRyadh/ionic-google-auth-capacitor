import {Component} from '@angular/core';
import {GoogleAuth} from '@codetrix-studio/capacitor-google-auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  userDetails = '';
  constructor() { }

  ionViewDidEnter() {
    GoogleAuth.initialize();
  }

  async doLogin() {
    const user = await GoogleAuth.signIn();
    if (user) {
      this.goToHome(user);
    }
  }

  goToHome(user) {
    console.log('User :', user);
    this.userDetails = user.email;
  }
}
