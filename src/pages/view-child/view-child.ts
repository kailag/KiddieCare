import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController, LoadingController, Platform } from 'ionic-angular';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildRecordPage } from '../add-child-record/add-child-record';
import { ConsultationProvider } from '../../providers/consultation/consultation';
import { DatabaseProvider } from '../../providers/database/database';
import { EditChildRecordPage } from '../edit-child-record/edit-child-record';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
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

  recordsJson: any;
  private win: any = window;
  
  view: string = 'records';

  constructor(public navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private consultationProvider: ConsultationProvider, private toastCtrl: ToastController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private dbProvider: DatabaseProvider, private file: File, private fileOpener: FileOpener, private plt: Platform) {

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
        this.recordsJson = JSON.stringify(this.records);
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
  
  displayImage(imagePath) {
    let image = this.win.Ionic.WebView.convertFileSrc(imagePath);
    return image;
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

  // generatePdf() {
  //   let alert = this.alertCtrl.create({
  //     title: 'Generate PDF',
  //     subTitle: 'Please enter a filename',
  //     inputs: [
  //       {
  //         name: 'fileName',
  //         label: 'Filename',
  //         type: 'text',
  //         placeholder: 'Enter filename',
  //       }
  //     ],
  //     buttons: [
  //       {
  //         text: 'Submit',
  //         handler: data => {
  //           if (data.fileName == '' || data.fileName == null) {
  //             this.presentToast('You must provide a filename!');
  //             return false;
  //           }
  //           this.presentLoading(`Creating your PDF file... ${data.fileName}.pdf`);
  //           const div = document.getElementById("pdfcontent");
  //           const options = { background: "white", height: div.clientHeight, width: div.clientWidth };

  //           if (this.plt.is('cordova')) {
  //             html2canvas(div, options).then((canvas) => {
  //               var doc = new jsPDF("p", "mm", "a4");

  //               let imgData = canvas.toDataURL("image/PNG");
  //               doc.addImage(imgData, 'PNG', 20, 20);

  //               let pdfOutput = doc.output();
  //               let buffer = new ArrayBuffer(pdfOutput.length);
  //               let array = new Uint8Array(buffer);
  //               for (var i = 0; i < pdfOutput.length; i++) {
  //                 array[i] = pdfOutput.charCodeAt(i);
  //               }

  //               // const fileDirectory = this.file.externalApplicationStorageDirectory;
  //               const fileDirectory = this.file.externalDataDirectory;
  //               const fileName = data.fileName;

  //               this.file.writeFile(fileDirectory, fileName, buffer, { replace: true })
  //                 .then((success) => {
  //                   this.loading.dismiss();
  //                   this.presentToast('Created PDF file ' + JSON.stringify(success));
  //                   this.fileOpener.open(fileDirectory + fileName, 'application/pdf');
  //                 })
  //                 .catch((error) => {
  //                   this.loading.dismiss();
  //                   this.presentToast('Unable to create file: ' + error)
  //                 });
  //             });

  //           } else {
  //             let doc = new jsPDF();
  //             let specialElementHandlers = {
  //               '#editor': function (element, renderer) {
  //                 return true;
  //               }
  //             };
  //             let pdfcontent = this.pdfcontent.nativeElement;
  //             doc.fromHTML(pdfcontent.innerHTML, 15, 15, {
  //               'width': 170,
  //               'elementHandlers': specialElementHandlers
  //             });
  //             doc.save(data.fileName);
  //           }
  //         }
  //       },
  //       {
  //         text: 'Cancel',
  //         role: 'cancel'
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

  generatePdf() {
    let rows = [];
    rows.push(['Date of visit', 'Type', 'Prescription', 'Instructions', 'Findings', 'Doctor', 'Date of next Visit']);

    this.items.forEach(item => {
      rows.push([item.consultation_date_of_visit, item.consultation_type, item.consultation_prescription, item.consultation_instructions, item.consultation_findings, item.consultation_doctor, item.consultation_date_of_next_visit]);
    });

    let docDefinition = {
      pageSize: 'A5',
      pageOrientation: 'landscape',
      content: [
        { text: `Generated: ${moment(new Date).format('MMMM DD, YYYY')}`, style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: rows
          }
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true,
          alignment: 'center'
        }
      }
    }

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