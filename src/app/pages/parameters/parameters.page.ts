import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../models/project';
import {ProjectService} from '../../services/project.service';
import {UserService} from '../../services/user.service';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {User} from '@firebase/auth';
import {CreateProjectComponent} from '../../modals/create-project/create-project.component';

@Component({
  selector: 'app-parameters',
  templateUrl: './parameters.page.html',
  styleUrls: ['./parameters.page.scss'],
})
export class ParametersPage implements OnInit {
  project: Project;

  constructor(private projectService: ProjectService,
              private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private toastController: ToastController,
              private alertController: AlertController,
              private modalController: ModalController) {}


  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const projectId = routeParams.get('projectId');
    this.projectService.selectProject(projectId);
    this.projectService.getSelectedProjectObservable().subscribe(selectedProject => this.project = selectedProject);
  }

  async deleteProject(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention !',
      message: `Pour confirmer la suppression du projet veuillez saisir son nom <strong>"${this.project?.name}"</strong>.`,
      inputs: [
        {
          name: 'projectName',
          type: 'text',
          placeholder: 'Nom du projet'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Confirmer',
          handler: (data) => {
            if (this.isAdmin() && data.projectName === this.project?.name) {
              this.projectService.deleteProject(this.project)
                .then(value => {
                  const msg = value ? 'Projet supprimé avec succès.' : 'Une erreur est survenue.';
                  this.toastController.create({
                    message: msg,
                    duration: 2000
                  }).then(toast => toast.present())
                    .then(() => this.router.navigate(['/projects'], {replaceUrl: true}));
                });
            } else {
              this.toastController.create({
                message: 'Projet non supprimé.',
                duration: 2000
              }).then(toast => toast.present());
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async leaveProject(): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention !',
      message: `Pour confirmer le désistement du projet veuillez saisir son nom <strong>"${this.project?.name}"</strong>.`,
      inputs: [
        {
          name: 'projectName',
          type: 'text',
          placeholder: 'Nom du projet'
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Confirmer',
          handler: (data) => {
            if (data.projectName === this.project?.name) {
              this.projectService.leaveProject(this.userService.getUser())
                .then(value => {
                  const msg = value ? 'Projet quitté avec succès.' : 'Une erreur est survenue.';
                  this.toastController.create({
                    message: msg,
                    duration: 2000
                  }).then(toast => toast.present())
                    .then(() => this.router.navigate(['/projects'], {replaceUrl: true}));
                });
            } else {
              this.toastController.create({
                message: 'Projet non quitté.',
                duration: 2000
              }).then(toast => toast.present());
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async goToEditProject(): Promise<void> {
    const modal = await this.modalController.create({
      component: CreateProjectComponent,
      breakpoints: [0, 0.3, 0.7, 1],
      initialBreakpoint: 0.7,
      componentProps: {
        projectId: this.project?.id,
      }
    });
    await modal.present();
  }

  isAdmin(): boolean {
    const user: User = this.userService.getUser();
    if (this.project === undefined || user === undefined) {return false;}
    return this.project.admin === user.uid;
  }

  findUserFromUid(uid: string): User | undefined {
    return this.userService.findUserFromUid(uid);
  }
}
