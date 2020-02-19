import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, ToastController, AlertController, Events } from 'ionic-angular';
import { ConsultationProvider } from '../../providers/consultation/consultation';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Calendar } from '@ionic-native/calendar';

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

  childName: any;

  addRecordForm: FormGroup;

  imagePreview: any;
  hasPhoto = false;
  imageFileName: any;
  tempBaseFilesystemPath: any;
  private win: any = window;

  constructor(public navParams: NavParams, public consultationProvider: ConsultationProvider, private fb: FormBuilder, private viewCtrl: ViewController, private toastCtrl: ToastController, private alertCtrl: AlertController, private camera: Camera, private file: File, private calendar: Calendar, public events: Events) {
    this.childName = this.navParams.get('childName');

    this.addRecordForm = this.fb.group({
      consultation_type: ['', Validators.required],
      consultation_findings: ['', this.consultation.consultation_type === 'Vaccination' ? Validators.required : ''],
      consultation_prescription: [''],
      consultation_instructions: [''],
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

  savePhoto() {
    const newFileName = `kc-${this.imageFileName}`;
    this.file.copyFile(this.tempBaseFilesystemPath, this.imageFileName, this.file.externalDataDirectory, newFileName)
      .then(success => {
        console.log(JSON.stringify(success));
        this.consultation.consultation_image_file = this.file.externalDataDirectory + newFileName;
        this.clearPhoto();
        this.deleteImage(this.tempBaseFilesystemPath, this.imageFileName);
      })
      .catch(err => {
        console.log(err);
        this.presentToast(`Error storing image: ${err}`)
      });
  }

  saveNextVisit() {
    let start = new Date(this.consultation.consultation_date_of_next_visit);
    let end = new Date();
    end.setDate(start.getDate());
    end.setHours(start.getHours());
    let suffix = this.consultation.consultation_type === 'Vaccination' ? 'Next Dose' : 'Next Visit';
    let eventTitle = `KiddieCare-${this.childName} - ${this.consultation.consultation_findings} - ${suffix}`;
    const options = { firstReminderMinutes: 15, secondReminderMinutes: 5, id: 'childRecord' }
    this.calendar.createEventWithOptions(eventTitle, '', '', start, end, options)
      .then(success => {
        console.log(success)
        this.events.publish('next-visit');
      })
      .catch(err => {
        console.log(err)
        this.presentToast(err);
      });
  }

  clearPhoto() {
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
    console.log(this.consultation);
    if (this.addRecordForm.invalid) {
      this.presentToast('Please fill out all required fields!');
      return;
    }
    let hasNextVisit = this.consultation.consultation_date_of_next_visit !== '' ? true : false;

    if (hasNextVisit && !this.hasPhoto) {
      this.saveNextVisit();
    }

    if (!hasNextVisit && this.hasPhoto) {
      this.savePhoto();
    }

    if (hasNextVisit && this.hasPhoto) {
      this.savePhoto();
      this.saveNextVisit();
    }

    this.viewCtrl.dismiss(this.consultation);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

}