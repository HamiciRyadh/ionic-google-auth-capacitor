import { Component, OnInit } from '@angular/core';
import {ProjectService} from '../../services/project.service';
import {Project} from '../../models/project';
import {Ticket} from '../../models/ticket';
import {ActivatedRoute, Router} from '@angular/router';
import {TicketService} from '../../services/ticket.service';
import {CreateProjectComponent} from '../../modals/create-project/create-project.component';
import {ModalController} from '@ionic/angular';
import {CreateTicketComponent} from '../../modals/create-ticket/create-ticket.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {

  project: Project;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private modalController: ModalController,
              private projectService: ProjectService,
              private ticketService: TicketService) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.projectService.selectProject(routeParams.get('projectId'));
    this.projectService.getSelectedProject().subscribe(selectedProject => this.project = selectedProject);
  }

  redirectToTicket(ticket: Ticket): void {
    this.router.navigate(['/ticket']).then(() =>{});
  }

  deleteTicket(ticket: Ticket): void {
    console.log('TODO: Delete ticket');
  }

  async modalCreateTicket(): Promise<void> {
    const modal = await this.modalController.create({
      component: CreateTicketComponent,
      swipeToClose: true,
    });
    await modal.present();
  }
}
