import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';


@Injectable()
export class DatabaseProvider {
  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;

  constructor(public http: HttpClient, public sqlitePorter: SQLitePorter, private storage: Storage, private sqlite: SQLite, private platform: Platform) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'kiddiecare.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('db_seed').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.createDB();
            }
          });
        });
    });
  }

  createDB() {
    this.http.get('assets/seed.sql', { responseType: 'text' })
      .subscribe(sql => {
        console.log(sql);
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('db_seed', true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
