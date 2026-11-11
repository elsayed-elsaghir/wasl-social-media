import { Pipe, PipeTransform } from '@angular/core';
import type { Post } from '../../features/timeline/components/posts/models/post.interface.js';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(arr: Post[], searchValue: string): Post[] {
    if (!searchValue.trim()) return arr;
    return arr.filter((el) => el.body?.toLowerCase().includes(searchValue?.toLowerCase()));
  }
}
