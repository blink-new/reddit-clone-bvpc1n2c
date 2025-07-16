import { useState } from 'react'
import { Plus, Link, Image, Type, Users } from 'lucide-react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Label } from './ui/label'
import { useSubreddits } from '../hooks/useSubreddits'
import { usePosts } from '../hooks/usePosts'
import { CreateCommunityDialog } from './CreateCommunityDialog'

export function CreatePostDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [url, setUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedSubreddit, setSelectedSubreddit] = useState('')
  const [postType, setPostType] = useState<'text' | 'link' | 'image'>('text')
  const [loading, setLoading] = useState(false)

  const { subreddits } = useSubreddits()
  const { createPost } = usePosts()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !selectedSubreddit) return

    setLoading(true)
    try {
      await createPost({
        title: title.trim(),
        content: postType === 'text' ? content.trim() : undefined,
        subreddit: selectedSubreddit,
        postType,
        url: postType === 'link' ? url.trim() : undefined,
        imageUrl: postType === 'image' ? imageUrl.trim() : undefined
      })

      // Reset form
      setTitle('')
      setContent('')
      setUrl('')
      setImageUrl('')
      setSelectedSubreddit('')
      setPostType('text')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a new post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subreddit">Choose a community</Label>
            {subreddits.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-3">No communities available</p>
                <p className="text-xs text-muted-foreground mb-4">Create a community first to post</p>
                <CreateCommunityDialog />
              </div>
            ) : (
              <Select value={selectedSubreddit} onValueChange={setSelectedSubreddit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subreddit" />
                </SelectTrigger>
                <SelectContent>
                  {subreddits.map((subreddit) => (
                    <SelectItem key={subreddit.id} value={subreddit.name}>
                      r/{subreddit.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <Tabs value={postType} onValueChange={(value) => setPostType(value as 'text' | 'link' | 'image')}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">
                <Type className="h-4 w-4 mr-2" />
                Text
              </TabsTrigger>
              <TabsTrigger value="link">
                <Link className="h-4 w-4 mr-2" />
                Link
              </TabsTrigger>
              <TabsTrigger value="image">
                <Image className="h-4 w-4 mr-2" />
                Image
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="An interesting title"
                  required
                />
              </div>

              <TabsContent value="text" className="space-y-2">
                <Label htmlFor="content">Text (optional)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What are your thoughts?"
                  rows={6}
                />
              </TabsContent>

              <TabsContent value="link" className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  required={postType === 'link'}
                />
              </TabsContent>

              <TabsContent value="image" className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required={postType === 'image'}
                />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim() || !selectedSubreddit}>
              {loading ? 'Creating...' : 'Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}