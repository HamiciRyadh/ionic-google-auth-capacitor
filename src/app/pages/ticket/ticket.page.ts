import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TicketService} from '../../services/ticket.service';
import {User} from '@firebase/auth';
import {UserService} from '../../services/user.service';
import {ModalController, Platform, ToastController} from '@ionic/angular';
import {CreateTicketComponent} from '../../modals/create-ticket/create-ticket.component';
import {ProjectService} from '../../services/project.service';
import {Attachment} from '../../models/attachment';
import {UploadImageService} from '../../services/upload-image.service';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {

  ticket;
  attachments: Attachment[] = [];
  private projectId = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private userService: UserService,
              private ticketService: TicketService,
              private modalController: ModalController,
              private toastController: ToastController,
              private uploadImageService: UploadImageService,
              public projectService: ProjectService,
              public platform: Platform) {}

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.projectId = routeParams.get('projectId');
    const ticketId = routeParams.get('ticketId');
    this.ticketService.getTicket(this.projectId, ticketId).subscribe((t)=>{
      this.ticket = t;
    });
    this.ticketService.getRelatedAttachments(this.projectId, ticketId).subscribe(result => this.attachments = result);
  }

  goBackToProject(): void {
    this.router.navigate([`/projects/${this.projectId}`], {replaceUrl: true}).then();
  }

  async addAttachment(): Promise<void> {
    if (this.ticket === undefined || this.projectId === '' || this.projectId === undefined) {
      return;
    }
    this.ticketService.addAttachment(this.ticket, this.projectId)
      .then(value => {
        const msg = value ? 'Pièce jointe ajoutée avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());
      });
  }

  deleteAttachment(attachment: Attachment): void {
    if (this.ticket === undefined || this.projectId === '' || this.projectId === undefined) {
      return;
    }
    this.ticketService.deleteAttachment(this.projectId, this.ticket.id, attachment)
      .then(value => {
        const msg = value ? 'Pièce jointe supprimée avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());
      });
  }

  async goToEditTicket(): Promise<void> {
    const modal = await this.modalController.create({
      component: CreateTicketComponent,
      breakpoints: [0, 0.3, 0.8, 1],
      initialBreakpoint: 0.8,
      componentProps: {
        projectId: this.projectId,
        ticketId: this.ticket.id,
      }
    });
    await modal.present();
  }

  findUserFromUid(uid: string): User | undefined {
    return this.userService.findUserFromUid(uid);
  }

  download(attachment: Attachment): void {
    this.uploadImageService.download(attachment.fileURL, attachment.name)
      .then(value => {
        const msg = value ? 'Téléchargement terminé.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());
      });
  }

  isPlatformAndroid(): boolean {
    return this.platform.is('android');
  }
}
