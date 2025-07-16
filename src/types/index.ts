export interface Post {
  id: string
  title: string
  content?: string
  subreddit: string
  authorId: string
  authorUsername: string
  upvotes: number
  downvotes: number
  commentCount: number
  postType: 'text' | 'link' | 'image'
  url?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Comment {
  id: string
  postId: string
  parentCommentId?: string
  content: string
  authorId: string
  authorUsername: string
  upvotes: number
  downvotes: number
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Vote {
  id: string
  userId: string
  postId?: string
  commentId?: string
  voteType: 'upvote' | 'downvote'
  createdAt: string
}

export interface Subreddit {
  id: string
  name: string
  displayName: string
  description?: string
  memberCount: number
  createdAt: string
  userId: string
}

export interface UserSubredditMembership {
  id: string
  userId: string
  subredditName: string
  joinedAt: string
}