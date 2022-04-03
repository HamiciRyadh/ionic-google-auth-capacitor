import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '@firebase/auth';
import {ActivatedRoute, Router} from '@angular/router';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project';
import {AlertController, ModalController, Platform, ToastController} from '@ionic/angular';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import {AddMemberComponent} from '../../modals/add-member/add-member.component';

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
              private toastController: ToastController,
              private modalController: ModalController,
              private callNumber: CallNumber,
              public platform: Platform) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const projectId = routeParams.get('projectId');
    const selectedProject: Project = this.projectService.getSelectedProject();
    if (selectedProject === undefined || selectedProject.id !== projectId) {
      this.projectService.selectProject(projectId);
    }

    this.userService.getObservableUsers().subscribe(users => this.users = users);
    this.userService.getObservableUser().subscribe(user => this.userId = user?.uid);
    this.projectService.getSelectedProjectObservable().subscribe(project => this.ownerId = project?.admin ?? '');
  }

  isPlatformAndroid(): boolean {
    return this.platform.is('android');
  }
  async call(user: User): Promise<void> {
    if (this.isPlatformAndroid()) {
      this.callNumber.callNumber(user.phoneNumber, true)
        .then(console.log)
        .catch(console.log);
    }
  }

  async addMember(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddMemberComponent,
      swipeToClose: true,
    });
    await modal.present();
  }

  async updateMember(user: User): Promise<void> {
    const currentStatus: boolean = this.projectService.canMemberWrite(user.uid);
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Status',
      inputs: [
        {
          name: 'visitor',
          type: 'radio',
          label: 'Invité',
          value: false,
          checked: !currentStatus,
          handler: () => {},
        },
        {
          name: 'member',
          type: 'radio',
          label: 'Membre',
          value: true,
          checked: currentStatus,
          handler: () => {}
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Ok',
          handler: (memberStatus) => {
            this.projectService.updateMemberRights(user, memberStatus)
              .then(value => {
                const msg = value ? 'Status modifié avec succès.' : 'Une erreur est survenue.';
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
            this.projectService.removeMember(user).then(value => {
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
