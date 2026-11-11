import { Component, inject, signal, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth.service.js';
import { ɵInternalFormsSharedModule } from '@angular/forms';
import { SearchService } from '../../../../core/auth/services/search.service.js';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ɵInternalFormsSharedModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  public readonly authService = inject(AuthService);
  user = JSON.parse(localStorage.getItem('user') || '{}');
  searchService = inject(SearchService);

  ngOnInit(): void {
    initFlowbite();
  }
}
