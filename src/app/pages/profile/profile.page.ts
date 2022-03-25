import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {User} from '@firebase/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User;
  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
    this.user = this.userService.getUser();
  }

  public redirectToHome(): void {
    this.router.navigate(['/home']).then(() => {});
  }

}
