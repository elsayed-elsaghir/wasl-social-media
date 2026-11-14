import { Component, HostListener, inject, signal, type OnInit } from '@angular/core';
import { CommentsComponent } from '../../timeline/components/posts/components/comments/comments.component';
import { Post, type User } from '../../timeline/components/posts/models/post.interface.js';
import { PostsService } from '../../timeline/components/posts/services/posts.service.js';
import { SearchService } from '../../../core/auth/services/search.service.js';
import { TimeAgoService } from '../../timeline/components/posts/services/time-ago.service.js';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { TranslatePipe } from '@ngx-translate/core';
import { SearchPipe } from '../../../shared/pipes/search-pipe.js';
import { RouterLink } from '@angular/router';
import { PostLikesComponent } from '../../timeline/components/posts/components/post-likes/post-likes.component';

@Component({
  selector: 'app-my-posts',
  imports: [
    CommentsComponent,
    InfiniteScrollDirective,
    TranslatePipe,
    SearchPipe,
    RouterLink,
    PostLikesComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './my-posts.component.html',
  styleUrl: './my-posts.component.css',
})
export class MyPostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  searchService = inject(SearchService);
  private readonly timeAgoService = inject(TimeAgoService);

  allPosts = signal<Post[]>([]);

  user = signal<User>(JSON.parse(localStorage.getItem('user')!));
  openDropdownId = signal<string | null>(null);
  imgSrc = signal('');
  file = signal<File | null>(null);
  privacy = new FormControl('public');
  content = new FormControl('');

  page: number = 1;
  loading: boolean = false;
  hasMore: boolean = true;

  ngOnInit(): void {
    this.getPostsData();
  }
  toggleDropdown(postId: string): void {
    this.openDropdownId.update((currentId) => (currentId === postId ? null : postId));
  }
  closeDropdown(): void {
    this.openDropdownId.set(null);
  }
  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: MouseEvent): void {
    const target = event.target as Element | null;

    if (!target?.closest('.dropdown-menu, .dropdown-toggle')) {
      this.closeDropdown();
    }
  }
  getPostsData(): void {
    if (this.loading || !this.hasMore) {
      return;
    }
    this.loading = true;

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
        const pagination = res.meta.pagination;

        if (pagination.nextPage != null) {
          this.page = pagination.nextPage;
          this.hasMore = true;
        } else {
          this.hasMore = false;
        }
        this.updatePostTimes();
      },
      error: (err) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  postTimes = signal<Record<string, string>>({});

  updatePostTimes(): void {
    const times: Record<string, string> = {};

    this.allPosts().forEach((post) => {
      times[post.id] = this.timeAgoService.timeAgo(post.createdAt);
    });

    this.postTimes.set(times);
  }

  fileChange(e: Event) {
    let input = e.target as HTMLInputElement;

    if (input.files) {
      this.file.set(input.files[0]);
      this.imgSrc.set(URL.createObjectURL(input.files[0]));
    }
  }
  removeImg() {
    this.file.set(null);
    this.imgSrc.set('');
  }

  submitForm(e: SubmitEvent) {
    e.preventDefault();

    let formData = new FormData();

    if (this.content.value?.trim()) {
      formData.append('body', this.content.value.trim());
    }
    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value ?? 'public');
    }
    if (this.file()) {
      formData.append('image', this.file()!);
    }

    this.postsService.createPost(formData).subscribe({
      next: (res) => {
        this.refreshPosts();
      },
      error: (err) => {},
      complete: () => {
        this.resetForm(e.target as HTMLFormElement);
      },
    });
  }

  onClickLike(postId: string) {
    this.postsService.likePost(postId).subscribe();
  }

  likingPosts = signal<string[]>([]);
  toggleLike(post: Post): void {
    if (this.likingPosts().includes(post.id)) return;

    const previousLiked = post.isLiked;

    // Prevent multiple requests for the same post
    this.likingPosts.update((ids) => [...ids, post.id]);

    // Update UI immediately
    this.allPosts.update((posts) =>
      posts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              isLiked: !previousLiked,
              likesCount: p.likesCount + (previousLiked ? -1 : 1),
            }
          : p,
      ),
    );

    this.postsService.toggleLike(post.id).subscribe({
      next: (res) => {},

      error: (err) => {
        // Roll back if API request fails
        this.allPosts.update((posts) =>
          posts.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  isLiked: previousLiked,
                  likesCount: p.likesCount + (previousLiked ? 1 : -1),
                }
              : p,
          ),
        );
      },

      complete: () => {
        this.likingPosts.update((ids) => ids.filter((id) => id !== post.id));
      },
    });
  }

  //////////////////////////////////////////

  // Edit Post
  selectedPost = signal<Post | null>(null);

  editContent = new FormControl('');

  editPrivacy = new FormControl('public');

  editFile = signal<File | null>(null);

  editImgSrc = signal('');

  // Open modal
  openEditModal(post: Post): void {
    this.selectedPost.set(post);

    this.editContent.setValue(post.body);
    this.editPrivacy.setValue(post.privacy);

    this.editFile.set(null);
    this.editImgSrc.set(post.image || '');
  }

  // Close modal
  closeEditModal(): void {
    this.selectedPost.set(null);
    this.editContent.reset();
    this.editPrivacy.setValue('public');
    this.editFile.set(null);
    this.editImgSrc.set('');
  }

  // Select new image
  editFileChange(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      this.editFile.set(file);
      this.editImgSrc.set(URL.createObjectURL(file));
    }
  }

  // Update post

  submitEditPost(e: SubmitEvent): void {
    e.preventDefault();
    console.log('submitEditPost');
    const post = this.selectedPost();

    if (!post) return;

    const body = this.editContent.value?.trim() ?? '';

    // Don't allow a completely empty post
    if (!body && !this.editFile() && !post.image) return;

    const formData = new FormData();

    formData.append('body', body);
    formData.append('privacy', this.editPrivacy.value ?? 'public');

    // Append the new image if the user selected one
    if (this.editFile()) {
      formData.append('image', this.editFile()!);
    }

    this.postsService.updatePost(post.id, formData).subscribe({
      next: (res) => {
        console.log('Update response:', res);

        const updatedPost = res.data.post;

        this.allPosts.update((posts) =>
          posts.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  body: body,
                  privacy: this.editPrivacy.value ?? 'public',
                  image: this.editFile() ? updatedPost.image : p.image,
                }
              : p,
          ),
        );

        this.closeEditModal();
      },
      error: (err) => {
        console.log('Update error:', err);
      },
    });
  }

  ////////////////////////////////////////

  updatePost(post: Post) {
    let formData = new FormData();
    formData.append('body', post.body);

    if (this.privacy.value) {
      formData.append('privacy', this.privacy.value);
    }
    formData.append('image', post.image);

    this.postsService.updatePost(post.id, formData).subscribe({
      next: (res) => {},
    });
  }

  resetForm(form: HTMLFormElement): void {
    // Reset HTML form fields
    form.reset();

    // Reset Angular FormControls
    this.content.reset('');
    this.privacy.reset('public');

    // Reset signals
    this.file.set(null);
    this.imgSrc.set('');
  }

  loadMorePosts() {
    this.getPostsData();
  }
  refreshPosts(): void {
    this.page = 1;
    this.hasMore = true;
    this.allPosts.set([]);
    this.getPostsData();
  }
  incrementCommentsCount(postId: string): void {
    this.allPosts.update((posts) =>
      posts.map((p) => (p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p)),
    );
  }

  deletePost(postId: string) {
    this.postsService.deletePost(postId).subscribe({
      next: (res) => {
        this.refreshPosts();
      },
      error: (err) => {},
    });
  }

  selectedImage = signal<string | null>(null);

  openImage(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
  }

  closeImage(): void {
    this.selectedImage.set(null);
  }

  selectedLikesPostId = signal<string | null>(null);
  openLikesModal(postId: string) {
    this.selectedLikesPostId.set(postId);
  }
  closeLikesModal(): void {
    this.selectedLikesPostId.set(null);
  }
}
