import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddSchedulePage } from './add-schedule';

@NgModule({
  declarations: [
    AddSchedulePage,
  ],
  imports: [
    IonicPageModule.forChild(AddSchedulePage),
  ],
})
export class AddSchedulePageModule {}
