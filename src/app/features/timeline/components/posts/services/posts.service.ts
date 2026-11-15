import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import { environment } from '../../../../../../environments/environment.js';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(page: number = 1): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'posts', {
      params: { page },
    });
  }
  getMyPosts(page: number = 1): Observable<any> {
    return this.httpClient.get(environment.baseUrl + 'posts/feed?only=following&limit=10', {
      params: { page },
    });
  }
  getSinglePost(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/${postId}`);
  }
  deletePost(postId: string): Observable<any> {
    return this.httpClient.delete(environment.baseUrl + `posts/${postId}`);
  }
  createPost(data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts`, data);
  }
  updatePost(postId: string, data: object): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}`, data);
  }
  likePost(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/like`, {});
  }
  toggleLike(postId: string): Observable<any> {
    return this.httpClient.put(environment.baseUrl + `posts/${postId}/like`, {});
  }
  getPostLikes(postId: string): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `posts/${postId}/likes?page=1&limit=20`);
  }
  getMyProfile(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `users/profile-data`);
  }
  getNotifications(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `notifications?unread=false&page=1&limit=10`);
  }
  getUnReadCount(): Observable<any> {
    return this.httpClient.get(environment.baseUrl + `notifications/unread-count`);
  }
  markNotification(notificationId: string): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `notifications/${notificationId}/read`, {});
  }
  markAllNotifications(): Observable<any> {
    return this.httpClient.patch(environment.baseUrl + `notifications/read-all`, {});
  }
}
