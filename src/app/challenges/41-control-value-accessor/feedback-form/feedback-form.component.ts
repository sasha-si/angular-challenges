import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {tap} from 'rxjs';

import {RatingControlComponent} from '../rating-control/rating-control.component';
import {FeedbackFormKeys} from './feedback-form.constants';

@Component({
  imports: [
    RatingControlComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  selector: 'app-feedback-form',
  templateUrl: 'feedback-form.component.html',
  styleUrls: ['feedback-form.component.less'],
  standalone: true,
})
export class FeedbackFormComponent implements OnInit {
  readonly FeedbackFormKeys = FeedbackFormKeys;
  feedbackForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {};

  ngOnInit(): void {    
    this.feedbackForm = this.fb.group({
      [FeedbackFormKeys.name]: ['', [Validators.required, Validators.minLength(3)]],
      [FeedbackFormKeys.email]: ['', [Validators.required, Validators.email]],
      [FeedbackFormKeys.emailConfirmation]: ['', [Validators.required, Validators.email]],
      [FeedbackFormKeys.rating]: [{value: '', disabled: true}, [Validators.required]],
      [FeedbackFormKeys.comment]: [''],
    }, {validators: this._emailConfirmationValidator});

    this._setEmailRequiredObserver();
  }

  private _emailConfirmationValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const emailControl = control.get(FeedbackFormKeys.email)?.value;
    const emailConfirmationControl = control.get(FeedbackFormKeys.emailConfirmation)?.value;
    return emailControl !== emailConfirmationControl ? {emailsNotMatch: true} : null;
  };

  submitForm(): void {
    console.log(this.feedbackForm.value);

    this.feedbackForm.reset();
  }
  
  private _setEmailRequiredObserver(): void {
    const emailControl = this.feedbackForm.get(FeedbackFormKeys.email);
    const ratingControl = this.feedbackForm.get(FeedbackFormKeys.rating);
  
    if (!emailControl || !ratingControl) return;
  
    this.feedbackForm.valueChanges.pipe(
      tap(() => {
        const hasError = this.feedbackForm.hasError('emailsNotMatch');
        const emailValid = emailControl.valid;

        if (!hasError && emailValid) {
          if (ratingControl.disabled) {
            ratingControl.enable();
          }
        } else {
          if (ratingControl.enabled) {
            ratingControl.reset({ value: '', disabled: true });
          }
        }
      })
    ).subscribe();
  }
}
