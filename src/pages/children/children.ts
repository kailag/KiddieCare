import { Component } from '@angular/core';
import { NavController, ModalController, AlertController, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DatabaseProvider } from '../../providers/database/database';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildPage } from '../add-child/add-child';
import { ViewChildPage } from '../view-child/view-child';
import { EditChildPage } from '../edit-child/edit-child';

@Component({
  selector: 'page-children',
  templateUrl: 'children.html'
})
export class ChildrenPage {
  children: any = [];
  photo: any;
  
  constructor(public navCtrl: NavController, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private dbProvider: DatabaseProvider, private alertCtrl: AlertController, private toastCtrl: ToastController, private camera: Camera) {
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readChildren();
      }
    })
  }

  ionViewDidLoad() {
    this.readChildren();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  readChildren() {
    this.childRecordsProvider.readChildren()
      .then(data => {
        this.children = data;
      })
      .catch(err => console.log(err));
  }

  addChild() {
    let modal = this.modalCtrl.create(AddChildPage);
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.childRecordsProvider.addChild(data)
          .then(res => {

            this.readChildren();
            this.presentToast('Child was added successfully!');

          }).catch(err => {
            console.log(err);
          })
      }
    });
  }

  viewChild(child) {
    this.navCtrl.push(ViewChildPage, { child: child });
  }

  editChild(child) {
    let modal = this.modalCtrl.create(EditChildPage, { child: child });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.childRecordsProvider.updateChild(data)
          .then(res => {

            this.readChildren();
            this.presentToast('Child updated successfully!')
          })
          .catch(e => console.log(e));
      }
    })
  }

  deleteChild(id: any) {

    //alert
    let alert = this.alertCtrl.create({
      title: 'WARNING!',
      subTitle: 'Are you sure you want to delete this child?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.childRecordsProvider.deleteChild(id)
              .then(res => {
                this.readChildren();
                this.presentToast('Child deleted successfully!');
              })
              .catch(e => console.log(e));
          }
        }
      ]
    });
    alert.present();
  }

  takePhoto(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.photo = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }

  getFromGallery(){
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum:false
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64 (DATA_URL):
     this.photo = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
     // Handle error
    });
  }
}