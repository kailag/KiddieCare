import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Injectable()
export class ScheduleProvider {
  private database: SQLiteObject;

  constructor(private sqlite: SQLite, private plt: Platform, public http: HttpClient) {
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

  readAllSchedules() {
    return this.database.executeSql('SELECT * FROM schedule')
      .then((data) => {
        let schedules = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            schedules.push({
              schedule_id: data.rows.item(i).schedule_id,
              schedule_date: new Date(data.rows.item(i).schedule_date).toISOString(),
              schedule_end: new Date(data.rows.item(i).schedule_end).toISOString(),
              schedule_description: data.rows.item(i).schedule_description,
              child_id: data.rows.item(i).child_id
            });
          }
        }
        return schedules;
      }, err => {
        console.log(err);
        return [];
      });
  }

  addSchedule(schedule) {
    return this.database.executeSql('INSERT INTO schedule (schedule_date, schedule_end, schedule_description, child_id) VALUES(?,?,?,?)', [schedule.schedule_date, schedule.schedule_end, schedule.schedule_description, schedule.child_id])
      .then(data => {
        return data
      }, err => {
        return err;
      });
  }

}
