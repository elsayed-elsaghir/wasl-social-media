import { Component, inject, signal } from '@angular/core';
import { MyTranslateService } from '../../../core/services/my-translate.service.js';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-btn-lang',
  imports: [],
  templateUrl: './btn-lang.component.html',
  styleUrl: './btn-lang.component.css',
})
export class BtnLangComponent {
  private readonly myTranslateService = inject(MyTranslateService);
  private readonly translateService = inject(TranslateService);

  currentLang = signal(localStorage.getItem('lang') || 'en');

  switchLanguage() {
    if (localStorage.getItem('lang') === 'en') {
      localStorage.setItem('lang', 'ar');
      this.translateService.use('ar');
      this.myTranslateService.changeDirection();
      this.currentLang.set('ar');
    } else {
      localStorage.setItem('lang', 'en');
      this.translateService.use('en');
      this.myTranslateService.changeDirection();
      this.currentLang.set('en');
    }
  }
}
