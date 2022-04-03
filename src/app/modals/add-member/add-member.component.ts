import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {ModalController, ToastController} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '@firebase/auth';
import {ProjectService} from '../../services/project.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss'],
})
export class AddMemberComponent implements OnInit {
  memberForm: FormGroup;
  prospectiveMemberExists: boolean | undefined;
  private user: User;

  constructor(private userService: UserService,
              private projectService: ProjectService,
              private modalController: ModalController,
              private toastController: ToastController,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.memberForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      canWrite: ['false']
    });
    this.prospectiveMemberExists = undefined;
  }

  addMember(): void {
    this.projectService.addMember(this.user, this.memberForm.get('canWrite').value)
      .then(value => {
        const msg = value ? 'Membre ajouté avec succès.' : 'Une erreur est survenue.';
        this.toastController.create({
          message: msg,
          duration: 2000
        }).then(toast => toast.present());
        this.closeModal();
      });
  }

  async verifyMember(): Promise<void> {
    this.user = await this.userService.findByEmail(this.memberForm.get('email').value);
    if (this.user) {
      this.prospectiveMemberExists = true;
    } else {
      this.prospectiveMemberExists = false;
    }
  }

  closeModal(): void {
    this.modalController.dismiss().then(() => {});
  }
}
