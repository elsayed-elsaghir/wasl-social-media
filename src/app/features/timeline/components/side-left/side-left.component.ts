import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-side-left',
  imports: [TranslatePipe],
  templateUrl: './side-left.component.html',
  styleUrl: './side-left.component.css',
})
export class SideLeftComponent {}
