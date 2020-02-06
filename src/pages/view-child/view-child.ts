import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { BoosterProvider } from '../../providers/booster/booster';
import { AddChildRecordPage } from '../add-child-record/add-child-record';
import { ConsultationProvider } from '../../providers/consultation/consultation';
import { EditChildRecordPage } from '../edit-child-record/edit-child-record';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';


import moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@IonicPage()
@Component({
  selector: 'page-view-child',
  templateUrl: 'view-child.html',
})
export class ViewChildPage {
  @ViewChild('pdfcontent') pdfcontent: ElementRef;

  pdfObj = null;
  child: any;
  records = [];
  searchTerm: any;
  radioTerm: any;
  items = [];
  loading: any;

  isRadio = false;
  isSearchBar = false;

  view: string = 'records';
  isRecordEntries = true;

  boosterList = [];
  checkedBoosters = [];
  boosterItems: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private consultationProvider: ConsultationProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private dbProvider: DatabaseProvider, private file: File, private fileOpener: FileOpener, private plt: Platform, private boosterProvider: BoosterProvider) {
    this.child = this.navParams.get('child');

    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readChildRecords();
      }
    });
  }

  initializeItems() {
    this.items = this.records;
  }

  presentLoading(msg) {
    this.loading = this.loadingCtrl.create({
      content: msg,
      spinner: 'dots'
    });
    this.loading.present();
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      showCloseButton: true
    });
    toast.present();
  }

  readChildRecords() {
    this.consultationProvider.readChildRecords(this.child.child_id)
      .then(data => {
        this.records = data;
        this.initializeItems();
      })
      .catch(e => console.log(e));
  }

  addChildRecord() {
    let modal = this.modalCtrl.create(AddChildRecordPage);
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        let newRecord = data;
        newRecord.child_id = this.child.child_id;
        console.log(newRecord);
        this.consultationProvider.addChildRecord(newRecord)
          .then(res => {
            this.readChildRecords();
            this.presentToast('Record successfully added!');
          })
          .catch(e => console.log(e));
      }
    });
  }

  viewImage(imageFile) {
    this.fileOpener.open(imageFile, 'image/jpeg')
      .then(res => console.log(res))
      .catch(err => this.presentToast('Error opening Image: ' + err))
  }

  editRecord(record) {
    let modal = this.modalCtrl.create(EditChildRecordPage, { record: record });
    modal.present();

    modal.onDidDismiss(data => {
      if (data) {
        this.consultationProvider.updateChildRecord(data)
          .then(res => {
            this.readChildRecords();
            this.presentToast('Successfully updated child record!')
          })
          .catch(e => console.log(e));
      }
    })
  }

  deleteRecord(id) {
    let alert = this.alertCtrl.create({
      title: 'WARNING!',
      subTitle: 'Are you sure you want to delete this record?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Agree',
          handler: () => {
            this.consultationProvider.deleteChildRecord(id)
              .then(res => {
                console.log(res);
                this.readChildRecords();
              })
              .catch(e => console.log(e));
          }
        }
      ]
    });
    alert.present();
  }

  isRecords(){
    this.isRecordEntries = true;
  }

  isBoosters() {
    this.isRecordEntries = false;
    this.checkedBoosters = [];
    this.boosterItems = '';
    this.boosterList = [];
    this.readChildBoosters();
    this.readBoosterList();
  }

  updateChildBoosters() {
    this.presentLoading('Updating Boosters');
    this.childRecordsProvider.updateBoosters(this.checkedBoosters, this.child.child_id)
      .then(success => {
        this.loading.dismiss();
        this.readChildBoosters();
        this.readBoosterList();
        this.presentToast('Boosters updated!');
        console.log(success);
      })
      .catch(err => {
        this.loading.dismiss();
        this.presentToast(err);
        console.log(err);
      });
  }

  readChildBoosters() {
    this.childRecordsProvider.readChildBoosters(this.child.child_id)
      .then(data => {
        this.boosterItems = data;
        console.log('CHILD BOOSTERS', this.boosterItems.boosters);
      })
      .catch(err => {
        console.log(err);
      })
  }

  readBoosterList() {
    this.boosterProvider.readBoosterList()
      .then(data => {
        this.boosterList = data;
      })
      .then(() => {
        this.checkBoosterItems();
      })
      .catch(err => {
        console.log(err);
      });
  }

  addToChecked(event, boosterId) {
    if (event.checked) {
      this.checkedBoosters.push(boosterId);
    } else {
      let index = this.checkedBoosters.findIndex(i => {
        return i === boosterId
      });
      this.checkedBoosters.splice(index, 1);
    }
    console.log('CHECKED BOOSTERS', this.checkedBoosters);
  }

  checkBoosterItems() {
    if (this.boosterItems.boosters !== '' || this.boosterItems.boosters !== null) {
      let boosterItems = this.boosterItems.boosters.split(',').map(item => Number(item));
      console.log('BOOSTER SPLIT', boosterItems);
      if (boosterItems.length > 0) {
        boosterItems.forEach(item => {
          let index = this.boosterList.findIndex(i => {
            return i.booster_id === item;
          });
          if (index !== -1) {
            this.boosterList[index].booster_stat = 1;
            this.checkedBoosters.push(this.boosterList[index].booster_id)
          }
          console.log(index);
        });
        console.log('CHECKED BOOSTERS', this.checkedBoosters);
        console.log('BOOSTER LIST', this.boosterList);
      }
    }
  }

  addBoosterToList() {
    let alert = this.alertCtrl.create({
      title: 'New Booster Shot',
      subTitle: 'Add a booster shot not on the list',
      inputs: [
        {
          type: 'text',
          placeholder: 'Enter Booster Shot Name',
          name: 'boosterName',
          label: 'Booster Name'
        }
      ],
      buttons: [
        {
          text: 'Submit',
          handler: data => {
            if (data.boosterName == '' || data.boosterName === null) {
              this.presentToast('You must provide a booster name');
              return false;
            }

            let booster = { booster_name: data.boosterName, booster_stat: 0, booster_type: 1 };
            this.boosterProvider.addBooster(booster)
              .then(res => {
                this.readBoosterList();
                this.presentToast('Booster successfully added!');
                console.log(res);
              })
              .catch(err => {
                this.presentToast(err);
                console.log(err);
              })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  deleteBooster(boosterId) {
    let alert = this.alertCtrl.create({
      title: 'Warning!',
      subTitle: 'Are you sure you want to delete this item?',
      buttons: [
        {
          text: 'Agree',
          handler: () => {
            this.boosterProvider.deleteBooster(boosterId)
              .then(res => {
                this.readBoosterList();
                this.presentToast('Booster successfully deleted!');
                console.log(res);
              })
              .catch(err => {
                this.presentToast(err);
                console.log(err);
              });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }

  onRadioFilter(type: string): void {
    this.initializeItems();
    if (type.trim() !== 'all') {
      this.isRadio = true;
      if (this.isSearchBar) {
        this.items = this.items.filter((item) => {
          return (item.consultation_type.toLowerCase().indexOf(type.toLowerCase()) > -1 && moment(item.consultation_date).format('MMMM YYYY').toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
        })
      } else {
        this.items = this.items.filter((item) => {
          return item.consultation_type.toLowerCase().indexOf(type.toLowerCase()) > -1;
        })
      }
    } else {
      this.isRadio = false;
      if (this.isSearchBar) {
        this.items = this.items.filter((item) => {
          return moment(item.consultation_date).format('MMMM YYYY').toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1;
        })
      }
    }
  }

  searchByPeriod(ev: any) {
    this.initializeItems();
    const val = ev.target.value;
    if (val && val.trim() != '') {
      this.isSearchBar = true;
      if (this.isRadio) {
        this.items = this.items.filter((item) => {
          return (moment(item.consultation_date).format('MMMM YYYY').toLowerCase().indexOf(val.toLowerCase()) > -1);
        });
      } else {
        this.items = this.items.filter((item) => {
          return moment(item.consultation_date).format('MMMM YYYY').toLowerCase().indexOf(val.toLowerCase()) > -1;
        });
      }
    } else {
      this.isSearchBar = false;
      if (this.isRadio) {
        this.onRadioFilter(this.radioTerm);
      }
    }
  }

  generatePdf() {
    if(this.items.length <= 0){
      this.presentToast('No Records to write on PDF report');
      return;
    }
    
    let rows = [];
    rows.push(['Date of visit', 'Type', 'Prescription', 'Instructions', 'Findings', 'Doctor', 'Date of next Visit']);

    this.items.forEach(item => {
      rows.push([item.consultation_date_of_visit, item.consultation_type, item.consultation_prescription, item.consultation_instructions, item.consultation_findings, item.consultation_doctor, item.consultation_date_of_next_visit]);
    });

    let alert = this.alertCtrl.create({
      title: 'Generate PDF',
      subTitle: 'Generate PDF from records',
      inputs: [
        {
          type: 'text',
          name: 'fileName',
          label: 'Filename',
          placeholder: 'Enter a filename'
        }
      ],
      buttons: [
        {
          text: 'Submit',
          handler: data => {
            if (data.fileName == '' || data.fileName == null) {
              this.presentToast('You must provide a filename!');
              return false;
            }

            let docDefinition = {
              pageSize: 'A5',
              pageOrientation: 'landscape',
              content: [
                { text: `Generated: ${moment(new Date()).format('MMM D, YYYY')}`, alignment: 'right', style: 'date' },
                { text: data.fileName, style: 'header' },
                {
                  table: { headerRows: 1, widths: ['*', '*', '*', '*', '*', '*', '*'], body: rows }
                }
              ],
              styles: {
                header: {
                  fontSize: 14,
                  bold: true,
                  alignment: 'center'
                },
                date: {
                  fontSize: 7,
                  margin: [0, 0, 0, 20]
                }
              }
            };

            this.presentLoading(`Creating your file... ${data.fileName}`);
            if (this.plt.is('cordova')) {
              const fileDirectory = this.file.externalDataDirectory;
              const fileName = data.fileName;
              this.pdfObj = pdfMake.createPdf(docDefinition);
              this.pdfObj.getBuffer((buffer) => {
                var blob = new Blob([buffer], { type: 'application/pdf' });
                this.file.writeFile(fileDirectory, fileName, blob, { replace: true })
                  .then(fileEntry => {
                    this.loading.dismiss();
                    this.fileOpener.open(fileDirectory + fileName, 'application/pdf');
                    console.log(JSON.stringify(fileEntry));
                  })
                  .catch((error) => {
                    this.loading.dismiss();
                    this.presentToast(`Unable to create file: ${error}`);
                  });
              });
            } else {
              this.pdfObj = pdfMake.createPdf(docDefinition);
              this.pdfObj.download();
              this.loading.dismiss();
            }
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    alert.present();
  }


}