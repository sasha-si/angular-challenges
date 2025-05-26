import { Component } from '@angular/core';
import {SidenavComponent} from './sidenav/sidenav.component';
import {ChallengesComponent} from './challenges/challenges.component';

@Component({
  imports: [
    SidenavComponent,
    ChallengesComponent,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: true,
})
export class AppComponent {
  title = 'angular-challenges';
}
