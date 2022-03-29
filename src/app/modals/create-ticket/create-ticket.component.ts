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
      owner: [this.userUid, [Validators.required]],
    });

    this.userService.getObservableUser().subscribe(user => {
      this.userUid = user.uid;
      this.ticketForm.controls.owner.setValue(this.userUid);
    });
    this.userService.getObservableUsers().subscribe(projectUsers => {
      this.projectParticipants = projectUsers;
    });
  }

  async createTicker(): Promise<void> {
    console.log(this.userUid);
    this.ticketService.addTicketToProject(new Ticket(this.ticketForm.get('name').value,
      this.ticketForm.get('description').value,
      this.ticketForm.get('type').value,
      this.ticketForm.get('priority').value,
      this.ticketForm.get('owner').value,
      this.userUid,
      this.projectService.getSelectedProject()),
      this.projectService.getSelectedProject())
      .then((success) => {
        const msg = success ? 'Ticket créé avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());

        if (success) {
          this.closeModal();
        }
      }).then(() => {})
      .catch(console.log);
  }

  closeModal(): void {
    this.modalController.dismiss().then(() => {});
  }

}
