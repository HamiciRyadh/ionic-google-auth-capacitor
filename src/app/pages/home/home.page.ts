import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {ModalController} from '@ionic/angular';
import {CreateProjectComponent} from '../../modals/create-project/create-project.component';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project';
import {User} from '@firebase/auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userProjects = [];
  otherProjects = [];
  user: User;

  constructor(private router: Router,
              private userService: UserService,
              private projectService: ProjectService,
              private modalController: ModalController) {}

  ngOnInit() {
    this.userService.getObservableUser().subscribe(user => {
      this.user = user;
      if (user != null) {
        this.projectService.getRelatedProjects(user).subscribe(projects => {
          this.userProjects = projects.filter(val => val.admin === user.uid);
          this.otherProjects = projects.filter(val => val.admin !== user.uid);
        });
      }
    });
  }

  redirectToProfile(): void{
    this.router.navigate(['/profile']).then(() =>{});
  }

  redirectToProject(project: Project): void{
    this.router.navigate([`/projects/${project.id}`]).then();
  }

  logOut(): void{
    this.userService.logout().then(() => this.router.navigate(['/login']));
  }

  async modalCreateProject(): Promise<void>{
    const modal = await this.modalController.create({
      component: CreateProjectComponent,
      breakpoints: [0, 0.4, 0.6, 1],
      initialBreakpoint: 0.6,
    });
    await modal.present();
  }
}
