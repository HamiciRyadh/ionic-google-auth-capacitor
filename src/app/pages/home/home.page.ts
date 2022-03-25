import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {CreateProjectComponent} from '../../modals/create-project/create-project.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(private router: Router,
              private userService: UserService,
              private modalController: ModalController) {}



  ngOnInit() {
  }

  redirectToProfile(): void{
    this.router.navigate(['/profile']).then(() =>{});
  }

  logOut(): void{
    this.userService.logOut()
      .then(()=>{
        this.router.navigate(['/login']).then(() =>{});
      });
  }

  async modalCreateProject(): Promise<void>{
    const modal = await this.modalController.create({
      component: CreateProjectComponent,
      swipeToClose: true,
    });
    await modal.present();
  }

  public deleteProject(): void{
    console.log('TODO: Delete Project');
  }

  public leaveProject(): void{
    console.log('TODO: Leave Project');
  }
}
