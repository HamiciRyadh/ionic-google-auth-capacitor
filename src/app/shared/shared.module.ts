import {NgModule} from '@angular/core';
import {MenuComponent} from './menu/menu.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  imports: [
    IonicModule
  ],
  exports: [
    MenuComponent
  ],
  declarations: [MenuComponent]
})
export class SharedModule {}
