import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '@firebase/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project';
import {AlertController, ToastController} from '@ionic/angular';

@Component({
  selector: 'app-members',
  templateUrl: './members.page.html',
  styleUrls: ['./members.page.scss'],
})
export class MembersPage implements OnInit {

  users: User[];
  ownerId: string;
  userId: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private projectService: ProjectService,
              private alertController: AlertController,
              private toastController: ToastController) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const projectId = routeParams.get('projectId');
    const selectedProject: Project = this.projectService.getSelectedProject();
    if (selectedProject === undefined || selectedProject.id !== projectId) {
      this.projectService.selectProject(projectId);
    }

    this.userService.getObservableUsers().subscribe(users => this.users = users);
    this.userService.getObservableUser().subscribe(user => this.userId = user.uid);
    this.projectService.getSelectedProjectObservable().subscribe(project => this.ownerId = project?.admin ?? '');
  }

  call(user: User): void {}

  addMember(): void {
  //  TODO: Ajouter un membre en canRead + canWrite
  }

  addVisitor(): void {
  //  TODO: Ajouter un membre en canRead seulement
  }

  async removeFromProject(user: User): Promise<void> {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Attention !',
      message: `Voulez-vous vraiment supprimer l'utilisateur <strong>"${user.displayName}"</strong> &lt;${user.email}&gt; ?`,
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: () => {}
        }, {
          text: 'Confirmer',
          id: 'confirm-button',
          handler: () => {
            this.userService.removeMember(user).then(value => {
              const msg = value ? 'Membre supprimé avec succès.' : 'Une erreur est survenue.';
              this.toastController.create({
                message: msg,
                duration: 2000
              }).then(toast => toast.present());
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
