import { FormControl, ValidationErrors } from '@angular/forms';

export class UtilityFormValidator {
  // whitespace validation
  static notOnlyWhitespace(control: FormControl): ValidationErrors | null {
    // check if the string contains only whitespace
    if (control.value != null && control.value.trim().length === 0) {
      // invalid, contains only while space
      return { notOnlyWhitespace: true };
    } else {
      // if valid, returns null
      return null;
    }
  }
}
