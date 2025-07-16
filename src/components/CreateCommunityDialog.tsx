import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Plus } from 'lucide-react'
import { useSubreddits } from '../hooks/useSubreddits'
import { toast } from '../hooks/use-toast'

export function CreateCommunityDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: ''
  })
  
  const { createSubreddit } = useSubreddits()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.displayName.trim()) {
      toast({
        title: "Error",
        description: "Community name and display name are required",
        variant: "destructive"
      })
      return
    }

    // Validate community name format
    if (!/^[a-zA-Z0-9_]+$/.test(formData.name)) {
      toast({
        title: "Error",
        description: "Community name can only contain letters, numbers, and underscores",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      await createSubreddit({
        name: formData.name.toLowerCase(),
        displayName: formData.displayName,
        description: formData.description
      })
      
      toast({
        title: "Success",
        description: `Community r/${formData.name} created successfully!`
      })
      
      setFormData({ name: '', displayName: '', description: '' })
      setOpen(false)
    } catch (error) {
      console.error('Error creating community:', error)
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Community
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Community</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Community Name</Label>
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-1">r/</span>
              <Input
                id="name"
                placeholder="programming"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="flex-1"
                maxLength={21}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Letters, numbers, and underscores only. Cannot be changed later.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Programming"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              maxLength={50}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="A community for programmers to share knowledge..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              maxLength={500}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Community'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}