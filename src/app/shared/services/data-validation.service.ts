import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DataValidationService {
  specialCharacterValidation(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
        control.value
      );

      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  public hasDisplayableError(
    form: FormGroup<any>,
    controlName: string,
    isSubmitted: boolean
  ): boolean {
    const control = form.get(controlName);
    return (
      Boolean(control?.invalid) && (isSubmitted || Boolean(control?.touched))
    );
  }

  idChangeValidation(editable: boolean, value: string): ValidatorFn {
    return (control) => {
      return control.value !== value && editable
        ? { idHasChanged: true }
        : null;
    };
  }

  //   ageOver16Validator: ValidatorFn = (
  //     control: AbstractControl
  //   ): ValidationErrors | null => {
  //     const date = new Date(control.value);
  //     const today = new Date();
  //     const age = today.getFullYear() - date.getFullYear();
  //     const isOldEnough =
  //       age > 16 ||
  //       (age === 16 &&
  //         (today.getMonth() > date.getMonth() ||
  //           (today.getMonth() === today.getMonth() &&
  //             today.getDate() >= date.getDate())));

  //     return isOldEnough ? null : { invalidAge: true };
  //   };

  minimumAgeValidator = (minAge: number): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const dateOfBirth = control.value;
      if (!dateOfBirth) {
        return null;
      }

      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        age === minAge &&
        (monthDifference < 0 ||
          (monthDifference === 0 && today.getDate() < birthDate.getDate()))
      ) {
        return { invalidAge: true };
      }

      return age >= minAge ? null : { invalidAge: true };
    };
  };

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value != confirmPassword.value
    ) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  };

  requireDigitValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const hasDigit = /\d/.test(control.value);
    return hasDigit ? null : { requireDigit: true };
  };

  requireLowercaseValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const hasLowercase = /[a-z]/.test(control.value);
    return hasLowercase ? null : { requireLowercase: true };
  };

  requireUppercaseValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const hasUppercase = /[A-Z]/.test(control.value);
    return hasUppercase ? null : { requireUppercase: true };
  };

  requireNonAlphanumericValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const hasNonAlphanumeric = /[^a-zA-Z0-9]/.test(control.value);
    return hasNonAlphanumeric ? null : { requireNonAlphanumeric: true };
  };
}
