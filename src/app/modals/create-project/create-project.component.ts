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
  project: Project = undefined;

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

  createOrUpdateProject(): void {
    if (this.projectId) {
      this.updateProject();
    } else {
      this.createProject();
    }
  }

  closeModal(): void {
    this.modalController.dismiss().then(() => {});
  }

  private createProject(): void {
    const name = this.projectForm.get('name').value.trim();
    const description = this.projectForm.get('description').value.trim();

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

  private updateProject(): void {
    const name = this.projectForm.get('name').value.trim();
    const description = this.projectForm.get('description').value.trim();

    this.project.name = name;
    this.project.description = description;
    this.projectService.updateProject(this.project)
      .then((success) => {
        const msg = success ? 'Projet modifié avec succès.' : 'Une erreur est survenue.';
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
