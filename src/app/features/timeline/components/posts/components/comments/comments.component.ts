import { Component, inject, Input, input, signal, type OnInit, Output, EventEmitter } from '@angular/core';
import { CommentsService } from '../../services/comments.service.js';
import type { Comment } from './models/comment.interface.js';
import { FormControl, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import type { User } from '../../models/post.interface.js';
import { TimeAgoService } from '../../services/time-ago.service.js';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-comments',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css',
})
export class CommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  public timeAgoService = inject(TimeAgoService);

  user: User = JSON.parse(localStorage.getItem('user') || '{}');

  ngOnInit(): void {
    this.getComments();
  }

  postId = input.required<string>();
  allComments = signal<Comment[]>([]);
  @Output() commentCreated = new EventEmitter<void>();
  commentImgSource = signal('');
  commentContent = new FormControl('');
  commentImg = signal<File | null>(null);
  getComments() {
    this.commentsService.getComments(this.postId()).subscribe({
      next: (res) => {
        this.allComments.set(res.data.comments);
      },
      error: (err) => {},
    });
  }

  commentFileChange(e: Event) {
    let input = e.target as HTMLInputElement;
    if (input.files) {
      this.commentImg.set(input.files[0]);
      this.commentImgSource.set(URL.createObjectURL(input.files[0]));
    }
  }
  submitComment(e: SubmitEvent) {
    e.preventDefault();

    let formData = new FormData();
    if (this.commentContent.value?.trim()) {
      formData.append('content', this.commentContent.value);
    }
    if (this.commentImg()) {
      formData.append('image', this.commentImg()!);
    }
    this.commentsService.createComments(this.postId(), formData).subscribe({
      next: (res) => {
        this.getComments();
        this.commentCreated.emit();
      },
      complete: () => {
        this.resetForm(e.target as HTMLFormElement);
      },
    });
  }
  resetForm(form: HTMLFormElement): void {
    form.reset();

    this.commentContent.reset('');
    this.commentImg.set(null);
    this.commentImgSource.set('');
  }

  selectedImage = signal<string | null>(null);

  openImage(imageUrl: string): void {
    this.selectedImage.set(imageUrl);
  }

  closeImage(): void {
    this.selectedImage.set(null);
  }
}
