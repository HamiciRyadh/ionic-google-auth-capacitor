import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MenuController} from '@ionic/angular';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private router: Router,
              private userService: UserService,
              private menu: MenuController) { }

  ngOnInit() {}

  redirectToProfile(): void {
    this.router.navigate(['/profile']).then(() => this.closeMenu());
  }

  redirectToHome(): void {
    this.router.navigate(['/home']).then(() => this.closeMenu());
  }

  redirectToTickets(): void {
    this.router.navigate(['/project']).then(() => this.closeMenu());
  }

  redirectToMembers(): void {
    this.router.navigate(['/members']).then(() => this.closeMenu());
  }

  redirectToParameters(): void {
    this.router.navigate(['/parameters']).then(() => this.closeMenu());
  }

  logout(): void {
    this.userService.logout().then(() => this.router.navigate(['/login']));
  }

  closeMenu(): Promise<boolean> {
    return this.menu.close('main_menu');
  }
}
