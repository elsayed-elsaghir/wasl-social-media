import { Component, inject, signal, type OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { MyTranslateService } from './core/services/my-translate.service.js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('Social');
  private readonly myTranslateService = inject(MyTranslateService);
  constructor() {
    this.myTranslateService.changeDirection();
  }
}
