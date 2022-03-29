import { Component, OnInit } from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {ProjectService} from '../../services/project.service';
import {UserService} from '../../services/user.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TicketService} from '../../services/ticket.service';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
})
export class CreateTicketComponent implements OnInit {

  ticketForm: FormGroup;

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
      priority: [5, Validators.required],
      ownerEmail: ['', [Validators.email]],
    });
  }

  createTicker(): void {}

  closeModal(): void {
    this.modalController.dismiss().then(() => {});
  }

}
