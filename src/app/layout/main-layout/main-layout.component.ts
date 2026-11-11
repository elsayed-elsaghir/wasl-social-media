import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BtnLangComponent } from '../../shared/ui/btn-lang/btn-lang.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, NavbarComponent, BtnLangComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {}
