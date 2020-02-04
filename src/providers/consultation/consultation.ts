import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Injectable()
export class ConsultationProvider {

  private database: SQLiteObject;

  constructor(public http: HttpClient, private sqlite: SQLite, private plt: Platform) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'kiddiecare.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
        });
    });
  }

  readChildRecords(child_id) {
    return this.database.executeSql('SELECT * FROM consultation WHERE child_id=?', [child_id])
      .then((data) => {

        // To test if data has data
        // console.log(data);

        let consultations = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            consultations.push({
              consultation_id: data.rows.item(i).consultation_id,
              consultation_type: data.rows.item(i).consultation_type,
              consultation_prescription: data.rows.item(i).consultation_prescription,
              consultation_instructions: data.rows.item(i).consultation_instructions,
              consultation_findings: data.rows.item(i).consultation_findings,
              consultation_doctor: data.rows.item(i).consultation_doctor,
              consultation_date_of_visit: data.rows.item(i).consultation_date_of_visit,
              consultation_date_of_next_visit: data.rows.item(i).consultation_date_of_next_visit,
              consultation_image_file: data.rows.item(i).consultation_image_file,
              child_id: data.rows.item(i).child_id
            })
          }
        }
        return consultations;
      }, err => {
        console.log(err);
        return [];
      });
  }

  addChildRecord(consultation) {
    return this.database.executeSql('INSERT INTO consultation(consultation_type, consultation_prescription, consultation_instructions, consultation_findings, consultation_doctor, consultation_date_of_visit, consultation_date_of_next_visit, consultation_image_file, child_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [consultation.consultation_type, consultation.consultation_prescription, consultation.consultation_instructions, consultation.consultation_findings, consultation.consultation_doctor, consultation.consultation_date_of_visit, consultation.consultation_date_of_next_visit, consultation.consultation_image_file, consultation.child_id])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

  updateChildRecord(consultation) {
    return this.database.executeSql('UPDATE consultation SET consultation_type=?, consultation_prescription=?, consultation_instructions=?, consultation_findings=?, consultation_doctor=?, consultation_date_of_visit=?, consultation_date_of_next_visit=?, consultation_image_file=? WHERE consultation_id=?', [consultation.consultation_type, consultation.consultation_prescription, consultation.consultation_instructions, consultation.consultation_findings, consultation.consultation_doctor, consultation.consultation_date_of_visit, consultation.consultation_date_of_next_visit, consultation.consultation_image_file, consultation.consultation_id])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

  deleteChildRecord(id) {
    return this.database.executeSql('DELETE FROM consultation WHERE consultation_id=?', [id])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

}
