import { ArrowUp, ArrowDown, MessageCircle, Share, Bookmark, MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader } from './ui/card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

interface PostCardProps {
  post: {
    id: string
    title: string
    content?: string
    subreddit: string
    author: string
    upvotes: number
    downvotes: number
    commentCount: number
    timeAgo: string
    postType: 'text' | 'link' | 'image'
    url?: string
    imageUrl?: string
  }
}

export function PostCard({ post }: PostCardProps) {
  const score = post.upvotes - post.downvotes

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">r/{post.subreddit}</span>
          <span>•</span>
          <span>Posted by u/{post.author}</span>
          <span>•</span>
          <span>{post.timeAgo}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex space-x-3">
          {/* Voting */}
          <div className="flex flex-col items-center space-y-1 min-w-[40px]">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary">
              <ArrowUp className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{score}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive">
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold mb-2 leading-tight">{post.title}</h3>
            
            {post.postType === 'text' && post.content && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.content}</p>
            )}
            
            {post.postType === 'link' && post.url && (
              <div className="mb-3">
                <a 
                  href={post.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-accent hover:underline text-sm"
                >
                  {post.url}
                </a>
              </div>
            )}
            
            {post.postType === 'image' && post.imageUrl && (
              <div className="mb-3">
                <img 
                  src={post.imageUrl} 
                  alt={post.title}
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <MessageCircle className="h-4 w-4 mr-1" />
                {post.commentCount} Comments
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Share className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Bookmark className="h-4 w-4 mr-1" />
                Save
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Hide</DropdownMenuItem>
                  <DropdownMenuItem>Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}