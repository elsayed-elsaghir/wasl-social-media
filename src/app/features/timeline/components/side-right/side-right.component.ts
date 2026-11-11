import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-side-right',
  imports: [TranslatePipe],
  templateUrl: './side-right.component.html',
  styleUrl: './side-right.component.css',
})
export class SideRightComponent {}
