import { Component } from '@angular/core';
import {ControlValueAccessorComponent} from './41-control-value-accessor/control-value-accessor.component';

@Component({
  selector: 'app-challenges',
  standalone: true,
  imports: [
    ControlValueAccessorComponent
  ],
  templateUrl: './challenges.component.html',
  styleUrl: './challenges.component.less'
})
export class ChallengesComponent {

}
