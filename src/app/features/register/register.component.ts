import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  type AbstractControl,
} from '@angular/forms';
import { AuthService } from '../../core/auth/services/auth.service.js';
import type { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass, RouterLink, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      username: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required, this.minimumAgeValidator]),
      gender: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl(''),
    },
    { updateOn: 'submit', validators: this.confirmPassword },
  );

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  msgError = signal('');
  loading = signal(false);
  registerSubscribe: Subscription = new Subscription();

  confirmPassword(group: AbstractControl) {
    let password = group.get('password')?.value;
    let rePassword = group.get('rePassword')?.value;

    if (password !== rePassword) {
      return { mismatch: true };
    }
    return null;
  }
  minimumAgeValidator(control: AbstractControl) {
    if (!control.value) {
      return null; // Validators.required handles empty values
    }

    const birthDate = new Date(control.value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

    if (!hasBirthdayPassed) {
      age--;
    }

    return age >= 12 ? null : { minimumAge: true };
  }
  submitForm() {
    if (this.registerForm.valid) {
      this.registerSubscribe.unsubscribe();
      this.loading.set(true);
      this.registerSubscribe = this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          this.msgError.set('');
          // navigate to login
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.msgError.set(err.error.message);
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
