import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController, AlertController, Platform } from 'ionic-angular';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { AddChildRecordPage } from '../add-child-record/add-child-record';
import { ConsultationProvider } from '../../providers/consultation/consultation';
import { DatabaseProvider } from '../../providers/database/database';
import { EditChildRecordPage } from '../edit-child-record/edit-child-record';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import moment from 'moment';

// import PdfPrinter from 'pdfmake';

// const fonts = {
//   Roboto: {
//     normal: 'fonts/Roboto-Regular.ttf',
//     bold: 'fonts/Roboto-Medium.ttf',
//     italics: 'fonts/Roboto-Italic.ttf',
//     bolditalics: 'fonts/Roboto-MediumItalic.ttf'
//   }
// };

// const printer = new PdfPrinter(fonts);


@IonicPage()
@Component({
  selector: 'page-view-child',
  templateUrl: 'view-child.html',
})
export class ViewChildPage {

  pdfObj = null;
  child: any;
  records: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public childRecordsProvider: ChildRecordsProvider, private modalCtrl: ModalController, private consultationProvider: ConsultationProvider, private toastCtrl: ToastController, private alertCtrl: AlertController, private dbProvider: DatabaseProvider, private file: File, private fileOpener: FileOpener, private plt: Platform) {

    this.child = this.navParams.get('child');
    this.dbProvider.getDatabaseState().subscribe(ready => {
      if (ready) {
        this.readChildRecords();
      }
    });

    // this.test();
  }

  test() {
    let alert = this.alertCtrl.create({
      title: 'Yo!',
      subTitle: 'Child ID: ' + this.child.child_id,
      buttons: ['OK']
    });
    alert.present();
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

  createPDF() {
    let rows = [];
    rows.push(['Date of visit', 'Type', 'Prescription', 'Instructions', 'Findings', 'Doctor', 'Date of next Visit']);

   for(let i:any=0;i<this.records.length;i++){
     for(let j of i){
       rows.push(j.consultation_date_of_visit, j.consultation_type, j.consultation_prescription, j.consultation_instructions, j.consultation_findings, j.consultation_doctor, j.consultation_date_of_next_visit);
     }
   }

    let docDefinition = {
      pageSize: 'A5',
      content:
      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          body: rows
        }
      }
    }
    if (this.plt.is('cordova')) {
      const title = 'Records';
      const fileDirectory = this.file.dataDirectory;
      this.pdfObj = pdfMake.createPdf(docDefinition);
      alert(`File will be saved in ${fileDirectory}`);
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        this.file.writeFile(fileDirectory, title, blob, { replace: true })
          .then(fileEntry => {
            // this.presentToast(`File Created! ${fileEntry}`)
            this.fileOpener.open(fileDirectory + title, 'appliction/pdf');
          })
          .catch((error) => {
            this.presentToast(`Unable to create file! ${error}`);
          });
      });
    } else {
      this.pdfObj = pdfMake.createPdf(docDefinition);
      this.pdfObj.download();
    }
  }


}