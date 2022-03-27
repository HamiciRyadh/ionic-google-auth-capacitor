import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParametersPageRoutingModule } from './parameters-routing.module';

import { ParametersPage } from './parameters.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParametersPageRoutingModule,
    SharedModule
  ],
  declarations: [ParametersPage]
})
export class ParametersPageModule {}
