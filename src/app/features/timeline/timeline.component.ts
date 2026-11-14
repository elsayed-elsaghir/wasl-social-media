import { Component } from '@angular/core';
import { SideLeftComponent } from './components/side-left/side-left.component';
import { SideRightComponent } from './components/side-right/side-right.component';
import { PostsComponent } from './components/posts/posts.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-timeline',
  imports: [SideLeftComponent, SideRightComponent, PostsComponent, RouterOutlet],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css',
})
export class TimelineComponent {}
