import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';

@Injectable()
export class ChildRecordsProvider {
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

  readChildren() {
    return this.database.executeSql('SELECT * FROM child ORDER BY first_name', [])
      .then((data) => {
        let children = [];
        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            children.push({
              child_id: data.rows.item(i).child_id,
              first_name: data.rows.item(i).first_name,
              middle_name: data.rows.item(i).middle_name,
              last_name: data.rows.item(i).last_name,
              birth_date: data.rows.item(i).birth_date
            })
          }
        }
        return children;
      }, err => {
        console.log(err);
        return [];
      });
  }

  readChild(child_id) {
    return this.database.executeSql('SELECT * FROM child WHERE child_id=?', [child_id])
      .then((data) => {
        let child;
        if (data.rows.length > 0) {
          child = {
            child_id: data.rows.item(0).child_id,
            first_name: data.rows.item(0).first_name,
            middle_name: data.rows.item(0).middle_name,
            last_name: data.rows.item(0).last_name,
            birth_date: data.rows.item(0).birth_date
          }
        }
        return child;
      }, err => {
        console.log(err);
        return [];
      });

  }

  addChild(child) {
    return this.database.executeSql('INSERT INTO child(first_name, middle_name, last_name, birth_date) VALUES(?, ?, ?, ?)', [child.first_name, child.middle_name, child.last_name, child.birth_date])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

  updateChild(child) {
    return this.database.executeSql('UPDATE child SET first_name=?, middle_name=?, last_name=?, birth_date=? WHERE child_id=?', [child.first_name, child.middle_name, child.last_name, child.birth_date, child.child_id])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

  deleteChild(id) {
    return this.database.executeSql('DELETE FROM child WHERE child_id=?', [id])
      .then(data => {
        return data;
      }, err => {
        console.log(err);
        return err;
      });
  }

  
}