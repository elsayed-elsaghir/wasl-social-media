import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BtnLangComponent } from '../../shared/ui/btn-lang/btn-lang.component';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, BtnLangComponent],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.css',
})
export class AuthLayoutComponent {}
