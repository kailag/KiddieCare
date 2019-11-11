import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { ChildrenPage } from '../children/children';
import { CalendarPage } from '../calendar/calendar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ChildrenPage;
  tab2Root = CalendarPage;
  tab3Root = ProfilePage;

  constructor() {

  }
}
