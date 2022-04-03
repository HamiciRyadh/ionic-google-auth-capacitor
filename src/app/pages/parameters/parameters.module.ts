import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ParametersPageRoutingModule } from './parameters-routing.module';

import { ParametersPage } from './parameters.page';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ParametersPageRoutingModule
  ],
  declarations: [ParametersPage]
})
export class ParametersPageModule {}
