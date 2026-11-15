import { Component, computed, inject, signal, type OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PostsService } from '../timeline/components/posts/services/posts.service.js';
import type { Notification } from './models/notification.interface.js';
import { RouterLink } from '@angular/router';

type NotificationFilter = 'all' | 'unread';

@Component({
  selector: 'app-notifications',
  imports: [DatePipe, RouterLink],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly postsService = inject(PostsService);

  activeFilter = signal<NotificationFilter>('all');

  notifications = signal<Notification[]>([]);

  loading = signal(false);

  notificationsError = signal(false);

  ngOnInit(): void {
    this.getNotifications();
    this.getUnReadCount();
  }

  // Fetch notifications
  getNotifications(): void {
    this.loading.set(true);
    this.notificationsError.set(false);

    this.postsService.getNotifications().subscribe({
      next: (res) => {
        this.notifications.set(res.data.notifications);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notificationsError.set(true);
      },
    });
  }
  getUnReadCount() {
    this.postsService.getUnReadCount().subscribe((res) => {
      this.unreadCount.set(res.data.unreadCount);
    });
  }

  // Filter notifications
  filteredNotifications = computed(() => {
    const items = this.notifications();

    if (this.activeFilter() === 'unread') {
      return items.filter((item) => !item.isRead);
    }

    return items;
  });

  // Unread count
  unreadCount = signal(0);

  // Date grouping
  groupedNotifications = computed(() => {
    const groups: Record<string, Notification[]> = {};

    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    for (const notification of this.filteredNotifications()) {
      const date = new Date(notification.createdAt);

      let group = 'Earlier';

      if (this.isSameDay(date, today)) {
        group = 'Today';
      } else if (this.isSameDay(date, yesterday)) {
        group = 'Yesterday';
      }

      if (!groups[group]) {
        groups[group] = [];
      }

      groups[group].push(notification);
    }

    return Object.entries(groups).map(([title, items]) => ({
      title,
      items,
    }));
  });

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  // Notification message
  getNotificationMessage(notification: Notification): string {
    switch (notification.type) {
      case 'like_post':
        return 'liked your post';

      case 'comment_post':
        return notification.entityType === 'comment'
          ? 'replied to your comment'
          : 'commented on your post';

      case 'share_post':
        return 'shared your post';

      case 'follow_user':
        return 'started following you';

      default:
        return 'interacted with you';
    }
  }

  // Notification preview
  getNotificationPreview(notification: Notification): string {
    const entity = notification.entity;

    if (notification.type === 'comment_post') {
      if (notification.entityType === 'comment') {
        return entity.content || '';
      }

      return entity.topComment?.content || entity.body || '';
    }

    if (notification.type === 'like_post') {
      return entity.body || '';
    }

    return '';
  }

  // Filter selection
  setFilter(filter: NotificationFilter): void {
    this.activeFilter.set(filter);
  }

  // Mark one notification as read
  markAsRead(id: string): void {
    this.postsService.markNotification(id).subscribe({
      next: () => {
        this.getUnReadCount();
        this.notifications.update((items) =>
          items.map((item) => (item._id === id ? { ...item, isRead: true } : item)),
        );
      },
    });

    // Connect your mark-as-read API endpoint here.
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    if (this.unreadCount() === 0) return;

    this.postsService.markAllNotifications().subscribe(() => {
      this.getUnReadCount();
      this.notifications.update((items) =>
        items.map((item) => ({
          ...item,
          isRead: true,
        })),
      );
    });

    // Connect your mark-all-as-read API endpoint here.
  }

  // Notification icon
  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      like_post: 'heart',
      comment_post: 'message-circle',
      share_post: 'share-2',
      follow_user: 'user-plus',
    };

    return icons[type] || 'bell';
  }

  // Reload
  refreshNotifications(): void {
    this.getNotifications();
  }
}
