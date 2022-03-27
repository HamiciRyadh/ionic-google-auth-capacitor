import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TicketPageRoutingModule } from './ticket-routing.module';

import { TicketPage } from './ticket.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TicketPageRoutingModule,
    SharedModule
  ],
  declarations: [TicketPage]
})
export class TicketPageModule {}
