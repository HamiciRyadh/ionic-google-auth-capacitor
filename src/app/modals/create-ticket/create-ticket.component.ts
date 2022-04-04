import { Component, OnInit } from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {ProjectService} from '../../services/project.service';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TicketService} from '../../services/ticket.service';
import {User} from '@firebase/auth';
import {Ticket} from '../../models/ticket';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
})
export class CreateTicketComponent implements OnInit {
  ticketForm: FormGroup;
  userUid: string;
  projectParticipants: User[] = [];

  /* Needed to Update a Ticket */
  ticketId = undefined;
  projectId = undefined;
  currentTicket: Ticket = undefined;

  constructor(private modalController: ModalController,
              private projectService: ProjectService,
              private ticketService: TicketService,
              private userService: UserService,
              private toastController: ToastController,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.ticketForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      type: ['task', Validators.required],
      priority: ['medium', Validators.required],
      status: ['open', Validators.required],
      owner: [this.userUid, [Validators.required]],
    });

    this.userService.getObservableUser().subscribe(user => {
      this.userUid = user?.uid ?? '';
      this.ticketForm.controls.owner.setValue(this.userUid);
    });
    this.userService.getObservableUsers().subscribe(projectUsers => {
      this.projectParticipants = projectUsers;
    });

    /* If we want to Update a Ticket */
    if (this.ticketId) {
      this.ticketService.getTicket(this.projectId, this.ticketId).subscribe((ticketRes: Ticket) => {
        this.currentTicket = ticketRes;
        this.ticketForm = this.fb.group({
          name: [ticketRes.name, Validators.required],
          description: [ticketRes.description, Validators.required],
          type: [ticketRes.type, Validators.required],
          priority: [ticketRes.priority, Validators.required],
          status: [ticketRes.status, Validators.required],
          owner: [ticketRes.owner, [Validators.required]],
        });
      });
    }
  }

  createOrUpdateTicket(): void {
    if (this.currentTicket != null) {
      this.updateTicket();
    } else {
      this.createTicket();
    }
  }

  closeModal(): void {
    this.modalController.dismiss().then(() => {});
  }

  private createTicket(): void {
    const project = this.projectService.getSelectedProject();
    this.ticketService.addTicketToProject(new Ticket(this.ticketForm.get('name').value.trim(),
        this.ticketForm.get('description').value.trim(),
        this.ticketForm.get('type').value,
        this.ticketForm.get('priority').value,
        this.ticketForm.get('owner').value,
        'open',
        this.userUid,
        project),
      project)
      .then((success) => {
        const msg = success ? 'Ticket créé avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());

        if (success) {
          this.closeModal();
        }
      }).then(() => {
    })
      .catch(console.log);
  }

  private updateTicket(): void {
    this.currentTicket.name = this.ticketForm.get('name').value.trim();
    this.currentTicket.description = this.ticketForm.get('description').value.trim();
    this.currentTicket.type = this.ticketForm.get('type').value;
    this.currentTicket.priority = this.ticketForm.get('priority').value;
    this.currentTicket.owner = this.ticketForm.get('owner').value;
    this.currentTicket.status = this.ticketForm.get('status').value;
    this.ticketService.updateTicketToProject(this.currentTicket, this.projectId)
      .then((success) => {
        const msg = success ? 'Ticket modifié avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());

        if (success) {
          this.closeModal();
        }
      }).then(() => {
    })
      .catch(console.log);
  }
}
