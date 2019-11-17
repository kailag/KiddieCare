import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Injectable()
export class ProfileProvider {

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

  readAllParent() {
    return this.database.executeSql('SELECT * FROM parent WHERE parent_id = 1', [])
      .then((data) => {
        let parent = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            parent.push({
              parent_id: data.rows.item(i).parent_id,
              first_name: data.rows.item(i).first_name,
              middle_name: data.rows.item(i).middle_name,
              last_name: data.rows.item(i).last_name
            })
          }
        }
        return parent;
      }, err => {
        console.log(err);
        return [];
      });
  }

  readParent(parent_id) {
    return this.database.executeSql('SELECT * FROM parent WHERE parent_id=?', [parent_id])
      .then((data) => {
        let parent;
        if (data.rows.length > 0) {
          parent = {
            parent_id: data.rows.item(0).parent_id,
            first_name: data.rows.item(0).first_name,
            middle_name: data.rows.item(0).middle_name,
            last_name: data.rows.item(0).last_name
          }
        }
        return parent;
      }, err => {
        console.log(err);
        return [];
      });

  }

  addParent(parent) {
    return this.database.executeSql('INSERT INTO parent(first_name, middle_name, last_name) VALUES(?, ?, ?, ?)', [parent.first_name, parent.middle_name, parent.last_name])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

  updateProfile(parent) {
    return this.database.executeSql('UPDATE parent SET first_name=?, middle_name=?, last_name=? WHERE parent_id=?', [parent.first_name, parent.middle_name, parent.last_name, parent.parent_id])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

}
