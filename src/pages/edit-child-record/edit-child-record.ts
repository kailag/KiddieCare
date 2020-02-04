import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

@IonicPage()
@Component({
  selector: 'page-edit-child-record',
  templateUrl: 'edit-child-record.html',
})
export class EditChildRecordPage {

  editForm: FormGroup;
  record: any

  imageFileName: any;
  tempBaseFilesystemPath: any;
  imagePreview: any;
  isNewPhoto: boolean = false;
  hasPhoto: boolean = false;

  private win: any = window;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private fb: FormBuilder, private camera: Camera, private file: File) {
    this.record = this.navParams.get('record');
    if (this.record.consultation_image_file !== null || this.record.consultation_image_file !== '') {
      this.imagePreview = this.win.Ionic.WebView.convertFileSrc(this.record.consultation_image_file);
      this.hasPhoto = true;
    }

    console.log('hasPhoto?', this.hasPhoto);

    this.editForm = this.fb.group({
      consultation_type: ['', Validators.required],
      consultation_prescription: [''],
      consultation_instructions: [''],
      consultation_findings: [''],
      consultation_doctor: [''],
      consultation_date_of_visit: ['', Validators.required],
      consultation_date_of_next_visit: [''],
    });
  }

  get f() { return this.editForm.controls }

  cancel() {
    this.viewCtrl.dismiss();
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
        this.isNewPhoto = true;
        this.imagePreview = this.win.Ionic.WebView.convertFileSrc(imagePath);
      });
  }

  removePhoto() {
    this.tempBaseFilesystemPath = '';
    this.imageFileName = '';
    this.imagePreview = '';
    this.hasPhoto = false;
    this.isNewPhoto = false;
  }

  updateChildRecord() {
    if (this.editForm.invalid) {
      return;
    }

    if (!this.hasPhoto) {
      this.record.consultation_image_file = null;
    }

    if (this.isNewPhoto) {
      const newFileName = `kc-${this.imageFileName}`;
      this.file.copyFile(this.tempBaseFilesystemPath, this.imageFileName, this.file.externalDataDirectory, newFileName)
        .then(success => {
          console.log(success);
          this.record.consultation_image_file = this.file.externalDataDirectory + newFileName;
          this.viewCtrl.dismiss(this.record);
          this.removePhoto();
        })
        .catch(err => console.log(err));
    } else {
      this.viewCtrl.dismiss(this.record);
    }

  }



}
