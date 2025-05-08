import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RatingControlComponent } from '../rating-control/rating-control.component';

@Component({
  imports: [
    RatingControlComponent,
    ReactiveFormsModule,
  ],
  selector: 'app-feedback-form',
  templateUrl: 'feedback-form.component.html',
  styleUrls: ['feedback-form.component.less'],
  standalone: true,
})
export class FeedbackFormComponent {
  readonly feedbackForm = new FormGroup({
    name: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
    email: new FormControl('', {validators: [Validators.required, Validators.email]}),
    rating: new FormControl('', {validators: Validators.required}),
    comment: new FormControl(),
  });

  submitForm(): void {
    console.log(this.feedbackForm.value);

    this.feedbackForm.reset();
  }
}
