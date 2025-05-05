import { Component } from '@angular/core';
import {FeedbackFormComponent} from './feedback-form/feedback-form.component';

@Component({
  selector: 'app-control-value-accessor',
  standalone: true,
  imports: [
    FeedbackFormComponent
  ],
  templateUrl: './control-value-accessor.component.html',
})
export class ControlValueAccessorComponent {
  
}
