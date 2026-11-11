import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service.js';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import type { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgClass, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  msgError = signal('');
  loading = signal(false);

  loginForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
    },
    { updateOn: 'submit' },
  );

  loginSubscription: Subscription = new Subscription();
  submitForm(): void {
    if (this.loginForm.valid) {
      this.loginSubscription.unsubscribe();
      this.loading.set(true);
      this.loginSubscription = this.authService.signIn(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.success) {
            this.msgError.set('');
            // save token and user data in local storage
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            // Navigate to timeline
            this.router.navigate(['/timeline']);
          }
        },
        error: (err) => {
          this.msgError.set('Incorrect email or password');
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
