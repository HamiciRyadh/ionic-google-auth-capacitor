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

  changeOrder(e): void{
    switch (e.detail.value){
      case 'creationDateTime':
        this.tickets.sort((t1:Ticket,t2:Ticket)=> {
          if(t1.creationDateTime === t2.creationDateTime){
            return 0;
          }else if(t1.creationDateTime < t2.creationDateTime){
            return 1;
          }else {
            return -1;
          }
        })
        break;
      case 'status':
        this.tickets.sort((t1:Ticket,t2:Ticket)=> {
          if(t1.status === t2.status){
            return 0;
          }else if(t1.status < t2.status){
            return 1;
          }else {
            return -1;
          }
        })
        break;
      case 'type':
        this.tickets.sort((t1:Ticket,t2:Ticket)=> {
          if(t1.type === t2.type){
            return 0;
          }else if(t1.type === 'task'){
            return 1;
          }else {
            return -1;
          }
        })
        break;
      case 'priority':
        this.tickets.sort((t1:Ticket,t2:Ticket)=> {
          if(t1.priority === t2.priority){
            return 0;
          }else if(t1.priority === 'high' || (t1.priority === 'medium' && t2.priority === 'low')){
            return -1;
          }else if(t1.priority === 'low'){
            return 1;
          }
        })
        break;
    }
  }
}
