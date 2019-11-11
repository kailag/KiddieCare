import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ChildRecordsProvider } from '../../providers/child-records/child-records';
import { ChildrenPage } from '../children/children';

@IonicPage()
@Component({
  selector: 'page-edit-child',
  templateUrl: 'edit-child.html',
})
export class EditChildPage {

  child;
  results: Array<any>;
  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private childRecordsProvider: ChildRecordsProvider) {
    this.child = navParams.data.child;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditChildPage');
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

  updateChild(id:string,first_name: string, middle_name: string,last_name: string,birth_date: string)
  {
    this.data.updateChild(id,first_name,middle_name,last_name,birth_date).subscribe(
        data => {
          this.results = data;
          console.log(data);
          if(this.results[0].result =="success")
          {
            this.navCtrl.popTo(ChildrenPage);
          }
        },
        err => {
          console.log(err);
        },
        () => console.log('Successfully updated!')
        
    );

  }

}
