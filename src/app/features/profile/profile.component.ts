import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { PostsService } from '../timeline/components/posts/services/posts.service.js';
import type { Post, User } from '../timeline/components/posts/models/post.interface.js';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MyPostsComponent } from '../home-feed/my-posts/my-posts.component';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, DatePipe, MyPostsComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  user = signal<User>({} as User);
  allPosts = signal<Post[]>([]);
  activeTab = signal<'myPosts' | 'saved'>('myPosts');
  postsCount = computed(() => this.allPosts().length);

  loading = false;
  hasMore = true;
  page = 1;

  followersCount = signal<number>(0);
  followingCount = signal<number>(0);
  bookmarksCount = signal<number>(0);

  ngOnInit(): void {
    this.getMyPosts();
  }

  getMyPosts(): void {
    if (this.loading || !this.hasMore) {
      return;
    }
    this.loading = true;
    this.postsService.getMyProfile().subscribe({
      next: (res) => {
        this.user.set(res.data.user);
        this.followersCount.set(res.data.user.followersCount);
        this.followingCount.set(res.data.user.followingCount);
        this.bookmarksCount.set(res.data.user.bookmarksCount);
      },
    });

    this.postsService.getMyPosts(this.page).subscribe({
      next: (res) => {
        const newPosts = res.data.posts.map((post: Post) => ({
          ...post,
          isLiked: post.likes.includes(this.user()._id),
        }));

        if (this.page === 1) {
          this.allPosts.set(newPosts);
        } else {
          this.allPosts.update((currentPosts) => [...currentPosts, ...newPosts]);
        }

        const pagination = res.meta?.pagination;
        if (pagination?.nextPage != null) {
          this.page = pagination.nextPage;
          this.hasMore = true;
        } else {
          this.hasMore = false;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  setTab(tab: 'myPosts' | 'saved'): void {
    this.activeTab.set(tab);
  }
}
