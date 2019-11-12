import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddChildRecordPage } from './add-child-record';

@NgModule({
  declarations: [
    AddChildRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(AddChildRecordPage),
  ],
})
export class AddChildRecordPageModule {}
