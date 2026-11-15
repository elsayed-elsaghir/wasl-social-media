export type NotificationType = 'like_post' | 'comment_post' | 'share_post' | 'follow_user';

export type NotificationEntityType = 'post' | 'comment' | 'user';

export interface NotificationUser {
  _id: string;
  name: string;
  photo: string;
  username?: string;
  followersCount?: number;
  followingCount?: number;
  bookmarksCount?: number;
}

export interface NotificationComment {
  _id: string;
  content: string;
  commentCreator: NotificationUser;
  post: string;
  parentComment?: string | null;
  likes?: string[];
  createdAt?: string;
}

export interface NotificationEntity {
  _id: string;
  body?: string;
  content?: string;
  user?: string;
  post?: string;

  commentCreator?: NotificationUser;

  commentsCount?: number;
  topComment?: NotificationComment | null;

  sharesCount?: number;
  likesCount?: number;

  isShare?: boolean;
  id: string;
}

export interface Notification {
  _id: string;

  recipient: NotificationUser;
  actor: NotificationUser;

  type: NotificationType;
  entityType: NotificationEntityType;

  entityId: string;
  entity: NotificationEntity;

  isRead: boolean;
  createdAt: string;
}
