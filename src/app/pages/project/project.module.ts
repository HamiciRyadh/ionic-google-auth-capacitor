import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectPageRoutingModule } from './project-routing.module';

import { ProjectPage } from './project.page';
import {SharedModule} from '../../shared/shared.module';
import {CreateTicketComponent} from '../../modals/create-ticket/create-ticket.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ProjectPageRoutingModule
  ],
  declarations: [ProjectPage, CreateTicketComponent]
})
export class ProjectPageModule {}
