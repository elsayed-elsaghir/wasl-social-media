import { Component, inject, signal, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { SearchService } from '../../../../core/auth/services/search.service.js';
import { TranslatePipe } from '@ngx-translate/core';
import { BtnLangComponent } from '../../../../shared/ui/btn-lang/btn-lang.component';
import { PostsService } from '../../../../features/timeline/components/posts/services/posts.service.js';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLink,
    RouterLinkActive,
    ɵInternalFormsSharedModule,
    TranslatePipe,
    BtnLangComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly postsService = inject(PostsService);
  user = JSON.parse(localStorage.getItem('user') || '{}');
  searchService = inject(SearchService);
  unreadCount = signal(0);

  ngOnInit(): void {
    initFlowbite();
    this.getUnReadCount();
  }

  getUnReadCount() {
    this.postsService.getUnReadCount().subscribe((res) => {
      this.unreadCount.set(res.data.unreadCount);
    });
  }
  removeUnreadCount() {
    this.unreadCount.set(0);
  }
}
