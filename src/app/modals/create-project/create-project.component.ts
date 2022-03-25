import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  projectForm: FormGroup ;
  listUsers: string[] = [];

  constructor(private modalController: ModalController,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      email: ['', [Validators.email]],
    });
  }

  addUser(){
    const invalid = this.projectForm.get('email').invalid;
    const email = this.projectForm.get('email').value;
    const index = this.listUsers.indexOf(email);
    if(index === -1 && !invalid){
      this.listUsers.push(email);
      this.projectForm.controls['email'].setValue('');
    }else if(index !== -1){
      this.projectForm.controls['email'].setValue('');
    }else if (invalid){
      // Todo: show error message!
    }
  }

  deleteUser(email): void {
    const index = this.listUsers.indexOf(email);
    this.listUsers.splice(index,1);
  }

  createProject(): void {

    const name = this.projectForm.get('name').value;
    const description = this.projectForm.get('description').value;
    this.modalController.dismiss().then(() => {
      console.log("Project created!");
      console.log("name :",name);
      console.log("description :",description);
      console.log("list Users :",this.listUsers);

    });
  }

  exit(): void{
    this.modalController.dismiss().then(() => {});
  }
}
