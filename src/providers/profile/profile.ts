import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfileProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ProfileProvider Provider');
  }

}
