import { Home, TrendingUp, Users, Plus, Star } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'
import { useSubreddits } from '../hooks/useSubreddits'
import { CreateCommunityDialog } from './CreateCommunityDialog'



const trendingTopics = [
  'AI and Machine Learning',
  'Web Development',
  'React 19 Updates',
  'TypeScript Tips',
  'Open Source Projects'
]

export function Sidebar() {
  const { subreddits, loading, joinSubreddit } = useSubreddits()
  
  const formatMemberCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }
  
  const getSubredditIcon = (name: string) => {
    const icons: Record<string, string> = {
      general: '🌍',
      technology: '💻',
      programming: '👨‍💻',
      funny: '😂',
      askreddit: '❓'
    }
    return icons[name] || '📝'
  }
  
  const handleJoinSubreddit = async (subredditName: string) => {
    try {
      await joinSubreddit(subredditName)
    } catch (error) {
      console.error('Failed to join subreddit:', error)
    }
  }

  return (
    <aside className="w-80 space-y-4">
      {/* Popular Communities */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Popular Communities
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-muted rounded animate-pulse"></div>
                    <div>
                      <div className="h-4 w-20 bg-muted rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="h-8 w-12 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : subreddits.length === 0 ? (
            <div className="text-center py-6">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-4">No communities yet</p>
              <CreateCommunityDialog />
            </div>
          ) : (
            <div className="space-y-2">
              {subreddits.slice(0, 5).map((sub) => (
                <div key={sub.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getSubredditIcon(sub.name)}</span>
                    <div>
                      <p className="text-sm font-medium">r/{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{formatMemberCount(sub.memberCount)} members</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleJoinSubreddit(sub.name)}
                  >
                    Join
                  </Button>
                </div>
              ))}
              <div className="pt-2">
                <CreateCommunityDialog />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Star className="h-4 w-4 mr-2" />
            Trending Today
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                <p className="text-sm">{topic}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            <Button className="w-full" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Find Communities
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}