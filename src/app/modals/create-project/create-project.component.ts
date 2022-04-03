import { Component, OnInit } from '@angular/core';
import {ModalController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Project} from '../../models/project';
import {ProjectService} from '../../services/project.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup ;

  constructor(private modalController: ModalController,
              private projectService: ProjectService,
              private userService: UserService,
              private toastController: ToastController,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', [Validators.email]],
    });
  }

  createProject(): void {
    const name = this.projectForm.get('name').value;
    const description = this.projectForm.get('description').value;
    this.projectService.createProject(new Project(name, description, this.userService.getUser().uid))
      .then((success) => {
        const msg = success ? 'Projet créé avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());

        if (success) {
          this.closeModal();
        }
      }).then()
      .catch(console.log);
  }

  closeModal(): void {
    this.modalController.dismiss().then(() => {});
  }
}
