import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component.js';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component.js';
import { LoginComponent } from './features/login/login.component.js';
import { RegisterComponent } from './features/register/register.component.js';
import { ProfileComponent } from './features/profile/profile.component.js';
import { TimelineComponent } from './features/timeline/timeline.component.js';
import { NotificationsComponent } from './features/notifications/notifications.component.js';
import { ChangePasswordComponent } from './features/change-password/change-password.component.js';
import { ForgetPasswordComponent } from './features/forget-password/forget-password.component.js';
import { NotFoundComponent } from './features/not-found/not-found.component.js';
import { authGuard } from './core/auth/guard/auth-guard.js';
import { guestGuard } from './core/auth/guard/guest-guard.js';
import { PostDetailsComponent } from './features/post-details/post-details.component.js';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [guestGuard],
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgetPassword', component: ForgetPasswordComponent },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'timeline', component: TimelineComponent },
      { path: 'notification', component: NotificationsComponent },
      { path: 'changePassword', component: ChangePasswordComponent },
      { path: 'details/:id', component: PostDetailsComponent },
    ],
  },
  { path: 'notfound', component: NotFoundComponent },
  { path: '**', redirectTo: 'notfound', pathMatch: 'full' },
];
