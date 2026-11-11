export interface Comment {
  _id: string;
  content: string;
  commentCreator: CommentCreator;
  image: string;
  post: string;
  parentComment: null;
  likes: any[];
  createdAt: string;
  repliesCount: number;
}

interface CommentCreator {
  _id: string;
  name: string;
  username: string;
  photo: string;
}
