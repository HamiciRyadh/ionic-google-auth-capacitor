import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {ModalController, ToastController} from '@ionic/angular';
import {CreateProjectComponent} from '../../modals/create-project/create-project.component';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  userProjects = [];
  otherProjects = [];

  constructor(private router: Router,
              private userService: UserService,
              private projectService: ProjectService,
              private modalController: ModalController,
              private toastController: ToastController) {}

  ngOnInit() {
    this.userService.getObservableUser().subscribe(user => {
      this.projectService.getRelatedProjects(user).subscribe(projects => {
        this.userProjects = projects.filter(val => val.admin === user.uid);
        this.otherProjects = projects.filter(val => val.admin !== user.uid);
        console.log(projects, this.userProjects, this.otherProjects);
      });
    });
  }

  redirectToProfile(): void{
    this.router.navigate(['/profile']).then(() =>{});
  }

  redirectToProject(project: Project): void{
    this.router.navigate(['/project']).then(() => this.projectService.selectProject(project));
  }

  logOut(): void{
    this.userService.logout().then(() => this.router.navigate(['/login']));
  }

  async modalCreateProject(): Promise<void>{
    const modal = await this.modalController.create({
      component: CreateProjectComponent,
      swipeToClose: true,
    });
    await modal.present();
  }

  public deleteProject(project: Project): void{
    this.projectService.deleteProject(project)
      .then(value => {
        const msg = value ? 'Projet supprimé avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());
      });
  }

  public leaveProject(): void{
    console.log('TODO: Leave Project');
  }
}
