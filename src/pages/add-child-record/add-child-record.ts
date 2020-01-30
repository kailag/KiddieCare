import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ToastController } from 'ionic-angular';
import { ConsultationProvider } from '../../providers/consultation/consultation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-add-child-record',
  templateUrl: 'add-child-record.html',
})
export class AddChildRecordPage {
  consultation = {
    consultation_id: '',
    consultation_type: '',
    consultation_prescription: '',
    consultation_instructions: '',
    consultation_findings: '',
    consultation_doctor: '',
    consultation_date_of_visit: '',
    consultation_date_of_next_visit: '',
    consultation_image_path: '',
    child_id: ''
  }

  addRecordForm: FormGroup;

  imagePreview: any;
  hasPhoto = false;
  imageFileName: any;
  tempBaseFilesystemPath: any;

  constructor(public navParams: NavParams, public consultationProvider: ConsultationProvider, private fb: FormBuilder, private viewCtrl: ViewController, private toastCtrl: ToastController, private camera: Camera, private file: File) {

    this.addRecordForm = this.fb.group({
      consultation_type: ['', Validators.required],
      consultation_prescription: ['', Validators.required],
      consultation_instructions: ['', Validators.required],
      consultation_findings: ['', Validators.required],
      consultation_doctor: ['', Validators.required],
      consultation_date_of_visit: ['', Validators.required],
      consultation_date_of_next_visit: ['', Validators.required],
    });
  }

  get f() { return this.addRecordForm.controls; }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  addPhoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      correctOrientation: true,
      saveToPhotoAlbum: false,
    };

    this.camera.getPicture(options)
      .then(imagePath => {

        this.imageFileName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        this.tempBaseFilesystemPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.hasPhoto = true;
        this.imagePreview = this.imageFileName;
      });
  }

  previewImage(img) {
    if (img === null) {
      return '';
    } else {
      return this.tempBaseFilesystemPath + img;
    }
  }

  removePhoto() {
    this.imageFileName = '';
    this.tempBaseFilesystemPath = '';
    this.imagePreview = '';
    this.hasPhoto = false;
  }

  addChildRecord() {
    if (this.addRecordForm.invalid) {
      this.presentToast('Please fill out all required fields!');
      return;
    }

    if (this.hasPhoto) {
      this.file.copyFile(this.tempBaseFilesystemPath, this.imageFileName, this.file.dataDirectory, this.imageFileName)
        .then(success => {
          this.consultation.consultation_image_path = (this.file.dataDirectory + this.imageFileName).toString();
          this.viewCtrl.dismiss(this.consultation);
        }, err => this.presentToast(`Error storing image: ${err}`));
    } else {
      this.consultation.consultation_image_path = null;
      this.viewCtrl.dismiss(this.consultation);
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}