import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TimeAgoService {
  private translate = inject(TranslateService);
  timeAgo(date: string): string {
    const createdAt = new Date(date).getTime();
    const now = Date.now();

    const seconds = Math.floor((now - createdAt) / 1000);

    if (seconds < 60) {
      return this.translate.instant('timeAgo.justNow');
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return this.translate.instant('timeAgo.minutes', { count: minutes });
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return this.translate.instant('timeAgo.hours', { count: hours });
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return this.translate.instant('timeAgo.days', { count: days });
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 4) {
      return this.translate.instant('timeAgo.weeks', { count: weeks });
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      return this.translate.instant('timeAgo.months', { count: months });
    }

    const years = Math.floor(days / 365);

    return this.translate.instant('timeAgo.years', { count: years });
  }
}
