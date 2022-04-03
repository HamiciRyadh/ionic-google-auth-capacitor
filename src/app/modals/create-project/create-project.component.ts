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

  // Needed to update a Project
  projectId = undefined;
  project: Project = undefined

  constructor(private modalController: ModalController,
              private projectService: ProjectService,
              private userService: UserService,
              private toastController: ToastController,
              private fb: FormBuilder) { }

  ngOnInit() {
    if(this.projectId) {
      this.project = this.projectService.getSelectedProject();
      this.projectForm = this.fb.group({
        name: [this.project.name , Validators.required],
        description: [this.project.description, Validators.required],
      });
    }else{
      this.projectForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
      });
    }
  }

  createProject(): void {
    const name = this.projectForm.get('name').value;
    const description = this.projectForm.get('description').value;

    if(this.projectId) {
      this.project.name = name;
      this.project.description = description;
      this.projectService.updateProject(this.project)
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
    }else {
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
  }

  closeModal(): void {
    this.modalController.dismiss().then(() => {});
  }
}
