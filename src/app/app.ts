import { Component, inject, signal, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { TranslateService } from './core/services/translate.service.js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Social');
  private readonly translateService = inject(TranslateService);
  constructor() {
    this.translateService.changeDirection();
  }
}
