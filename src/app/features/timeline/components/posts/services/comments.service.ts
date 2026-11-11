import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.js';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getComments(postId: string, limit: number = 10): Observable<any> {
    return this.httpClient.get(
      environment.baseUrl + `posts/${postId}/comments?page=1&limit=${limit}`,
    );
  }
  createComments(postId: string, data: object): Observable<any> {
    return this.httpClient.post(environment.baseUrl + `posts/${postId}/comments`, data);
  }
}
