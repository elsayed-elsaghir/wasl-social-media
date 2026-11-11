import { Component, inject, input, output, signal, type OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service.js';
import type { Like } from '../../models/like.interface.js';

@Component({
  selector: 'app-post-likes',
  imports: [],
  templateUrl: './post-likes.component.html',
  styleUrl: './post-likes.component.css',
})
export class PostLikesComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  postId = input.required<string>();
  postLikes = signal<Like[]>([]);
  isLoaded = signal(false);

  ngOnInit(): void {
    this.getPostLikes();
  }

  getPostLikes() {
    this.isLoaded.set(false);
    this.postsService.getPostLikes(this.postId()).subscribe({
      next: (res) => {
        this.postLikes.set(res.data.likes ?? []);
        this.isLoaded.set(true);
      },
      error: () => {
        this.isLoaded.set(true);
      },
    });
  }
  closed = output<void>();

  closeModal() {
    this.closed.emit();
  }
}
