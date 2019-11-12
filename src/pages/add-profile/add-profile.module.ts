import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddProfilePage } from './add-profile';

@NgModule({
  declarations: [
    AddProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(AddProfilePage),
  ],
})
export class AddProfilePageModule {}
