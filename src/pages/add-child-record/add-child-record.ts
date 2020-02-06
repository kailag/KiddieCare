import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
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
    consultation_image_file: '',
    child_id: ''
  };

  addRecordForm: FormGroup;

  imagePreview: any;
  hasPhoto = false;
  imageFileName: any;
  tempBaseFilesystemPath: any;
  private win: any = window;

  constructor(public navParams: NavParams, public consultationProvider: ConsultationProvider, private fb: FormBuilder, private viewCtrl: ViewController, private toastCtrl: ToastController, private alertCtrl: AlertController, private camera: Camera, private file: File) {

    this.addRecordForm = this.fb.group({
      consultation_type: ['', Validators.required],
      consultation_prescription: [''],
      consultation_instructions: [''],
      consultation_findings: [''],
      consultation_doctor: [''],
      consultation_date_of_visit: ['', Validators.required],
      consultation_date_of_next_visit: ['']
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

  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: ['Ok'],
      enableBackdropDismiss: false
    });
    alert.present();
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
        this.imagePreview = this.win.Ionic.WebView.convertFileSrc(imagePath);
      });
  }

  removePhoto() {
    this.imageFileName = '';
    this.tempBaseFilesystemPath = '';
    this.imagePreview = '';
    this.hasPhoto = false;
  }

  deleteImage(imagePath: string, fileName: string): void {
    this.file.removeFile(imagePath, fileName)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  addChildRecord() {
    if (this.addRecordForm.invalid) {
      this.presentToast('Please fill out all required fields!');
      return;
    }

    if (this.hasPhoto) {
      const newFileName = `kc-${this.imageFileName}`;
      this.file.copyFile(this.tempBaseFilesystemPath, this.imageFileName, this.file.externalDataDirectory, newFileName)
        .then(success => {
          this.consultation.consultation_image_file = this.file.externalDataDirectory + newFileName;
          this.removePhoto();
          this.viewCtrl.dismiss(this.consultation);
          this.deleteImage(this.tempBaseFilesystemPath, this.imageFileName);
        }, err => this.presentToast(`Error storing image: ${err}`));
    } else {
      this.consultation.consultation_image_file = null;
      this.viewCtrl.dismiss(this.consultation);
    }
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}