import { Component, inject, input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PostsService } from '../timeline/components/posts/services/posts.service.js';
import type { Post, User } from '../timeline/components/posts/models/post.interface.js';
import { CommentsComponent } from '../timeline/components/posts/components/comments/comments.component';
import { FormControl, ReactiveFormsModule, ɵInternalFormsSharedModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-post-details',
  imports: [
    CommentsComponent,
    ReactiveFormsModule,
    ɵInternalFormsSharedModule,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  post = signal<Post>({} as Post);
  user = signal<User>(JSON.parse(localStorage.getItem('user')!));
  postId!: string | null;
  openDropdownId = signal<string | null>(null);

  privacy = new FormControl('public');
  content = new FormControl('');
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((param) => {
      this.getSinglePost(param.get('id')!);
    });
  }

  getSinglePost(postId: string) {
    this.postsService.getSinglePost(postId).subscribe({
      next: (res) => {
        this.post.set(res.data.post);
      },
      error: (err) => {},
    });
  }
  deletePost(postId: string) {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        this.refreshPosts();
      },
      error: (err) => {},
    });
  }
  incrementCommentsCount(): void {
    this.post.update((p) => ({ ...p, commentsCount: p.commentsCount + 1 }));
  }

  refreshPosts() {}
  toggleDropdown(postId: string): void {
    this.openDropdownId.update((currentId) => (currentId === postId ? null : postId));
  }
  timeAgo(date: string): string {
    const createdAt = new Date(date).getTime();
    const now = Date.now();

    const seconds = Math.floor((now - createdAt) / 1000);

    if (seconds < 60) {
      return 'just now';
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 30) {
      return `${days}d ago`;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      return `${months}mo ago`;
    }

    const years = Math.floor(days / 365);

    return `${years}y ago`;
  }
}
