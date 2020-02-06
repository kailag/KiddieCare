import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Injectable()
export class BoosterProvider {
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

  readBoosterList() {
    return this.database.executeSql('SELECT * FROM booster', [])
      .then((data) => {
        let boosters = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            boosters.push({
              booster_id: data.rows.item(i).booster_id,
              booster_name: data.rows.item(i).booster_name,
              booster_stat: data.rows.item(i).booster_stat,
              booster_type: data.rows.item(i).booster_type,
            })
          }
        }
        return boosters;
      }, err => {
        console.log(err);
        return [];
      });
  }

  deleteBooster(boosterId) {
    return this.database.executeSql('DELETE FROM booster WHERE booster_id=?', [boosterId])
      .then(success => {
        console.log(success);
        return success
      }, err => {
        console.log(err)
        return err;
      })
  }

  addBooster(booster) {
    return this.database.executeSql('INSERT INTO booster(booster_name, booster_stat, booster_type) VALUES(?,?,?)', [booster.booster_name, booster.booster_stat, booster.booster_type])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

}
