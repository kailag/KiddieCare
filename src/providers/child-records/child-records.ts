import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ChildRecordsProvider {
  children: any = [];

  constructor(public http: HttpClient, private sqlite: SQLite) {
    console.log('Hello ChildRecordsProvider Provider');
  }

  getData() {
    return this.sqlite.create({
      name: 'kiddiecare.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS child(rowid INTEGER PRIMARY KEY, name TEXT)', [])
        .then(res => console.log('Executed SQL'))
        .catch(e => console.log(e));
      db.executeSql('SELECT * FROM child ORDER BY rowid DESC', [])
        // .then(res => {
        //   // for (let i = 0; i < res.rows.length; i++) {
        //   //   this.children.push({ rowid: res.rows.item(i).rowid, date: res.rows.item(i).date, type: res.rows.item(i).type, description: res.rows.item(i).description, amount: res.rows.item(i).amount })
        //   // }
        // })
        .catch(e => console.log(e));
    })
  }
}
