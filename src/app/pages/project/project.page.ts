import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project';
import {Ticket} from '../../models/ticket';
import {ActivatedRoute, Router} from '@angular/router';
import {TicketService} from '../../services/ticket.service';
import {ModalController, ToastController} from '@ionic/angular';
import {CreateTicketComponent} from '../../modals/create-ticket/create-ticket.component';
import {User} from '@firebase/auth';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {

  project: Project;
  tickets: Ticket[];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private userService: UserService,
              private projectService: ProjectService,
              private ticketService: TicketService,
              private toastController: ToastController) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    const projectId = routeParams.get('projectId');
    this.projectService.selectProject(projectId);
    this.projectService.getSelectedProjectObservable().subscribe(selectedProject => this.project = selectedProject);
    this.ticketService.getRelatedTicketsOfProject(projectId).subscribe(relatedTickets => this.tickets = relatedTickets);
  }

  redirectToTicket(ticket: Ticket): void {
    this.router.navigate([`/projects/${this.project.id}/tickets/${ticket.id}`], { replaceUrl: true }).then(() =>{});
  }

  deleteTicket(ticket: Ticket): void {
    this.ticketService.deleteTicketFromProject(ticket, this.project.id)
      .then(value => {
        const msg = value ? 'Ticket supprimé avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());
      });
  }

  async modalCreateTicket(): Promise<void> {
    const modal = await this.modalController.create({
      component: CreateTicketComponent,
      swipeToClose: true,
    });
    await modal.present();
  }

  findUserFromUid(uid: string): User | undefined {
    return this.userService.findUserFromUid(uid);
  }
}
