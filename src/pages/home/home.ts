import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { babyData } from '../../data/sample-data';
import { HttpClient } from '@angular/common/http';
import {ChildRecordsProvider} from '../../providers/child-records/child-records';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  baby = babyData;
  comments: any;
  children: any = [];

  constructor(public navCtrl: NavController, private http:HttpClient, private childProvider:ChildRecordsProvider) {
    this.getData();
  }

  ionViewDidLoad(){

  }

  getData(){
    this.http.get('http://jsonplaceholder.typicode.com/comments')
    .subscribe(data=>{
      this.comments = data;
    });
  }

  // deleteData(comment){
  //   this.http.post(`http://jsonplaceholder.typicode.com/comments/delete/${comment.id}`)
  // }

  // getData(){
  //   this.childProvider.getData().then(data =>{
  //     this.children = data;
  //   })
  // }

}
