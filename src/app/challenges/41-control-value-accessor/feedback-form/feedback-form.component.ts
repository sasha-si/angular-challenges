import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import {debounceTime, delay, filter, of, switchMap, tap} from 'rxjs';

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

  get extraControls() {
    return this.feedbackForm.get('extraControls') as FormArray;
  }

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
      // Extra controls array
      [FeedbackFormKeys.extraControls]: this.fb.array([], [Validators.maxLength(4), this._lastExtraControlFilledValidator]),
    }, {validators: this._emailConfirmationValidator}),

    this._setEmailRequiredObserver();
    this._setFormSubmitObserver();
  }

  submitForm(): void {
    alert(JSON.stringify(this.feedbackForm.value));
    this.feedbackForm.reset();
  }

  addExtraControl(): void {
    if (this.extraControls.length < 5)
      this.extraControls.push(this.fb.control(''));
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
      }),
    ).subscribe();
  }

  private _setFormSubmitObserver():void {
    this.feedbackForm.valueChanges.pipe(
      debounceTime(1500),
      filter(() => this.feedbackForm.touched && this.feedbackForm.valid),
    ).subscribe(() => {
      alert(JSON.stringify(this.feedbackForm.value));
    });
  }
  
  resetForm(): void {
    const extraControls = this.feedbackForm.get(FeedbackFormKeys.extraControls) as FormArray;

    if (extraControls) {
      extraControls.clear();
    }

    this.feedbackForm.reset();
  }

  // #region Custom validators
  private _emailConfirmationValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const emailControl = control.get(FeedbackFormKeys.email);
    const emailConfirmationControl = control.get(FeedbackFormKeys.emailConfirmation);

    if (emailControl?.invalid || emailConfirmationControl?.invalid) return null;

    return emailControl?.value !== emailConfirmationControl?.value ? {emailsNotMatch: true} : null;
  };

  private _lastExtraControlFilledValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    if (!control.value.length) return null;
    
    const lastExtraControlFilled = !control.value.some((el: string) => el === '');
    return lastExtraControlFilled  ? null : {lastExtraControlNotFilled: true};
  };
  // #endregion
}
