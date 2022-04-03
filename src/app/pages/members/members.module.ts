import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MembersPageRoutingModule } from './members-routing.module';

import { MembersPage } from './members.page';
import {AddMemberComponent} from '../../modals/add-member/add-member.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MembersPageRoutingModule
  ],
  declarations: [MembersPage, AddMemberComponent]
})
export class MembersPageModule {}
