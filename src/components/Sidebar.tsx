import { Home, TrendingUp, Users, Plus, Star } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Separator } from './ui/separator'

const popularSubreddits = [
  { name: 'general', members: '2.1M', icon: '🌍' },
  { name: 'technology', members: '1.8M', icon: '💻' },
  { name: 'programming', members: '1.2M', icon: '👨‍💻' },
  { name: 'funny', members: '3.5M', icon: '😂' },
  { name: 'askreddit', members: '2.8M', icon: '❓' },
]

const trendingTopics = [
  'AI and Machine Learning',
  'Web Development',
  'React 19 Updates',
  'TypeScript Tips',
  'Open Source Projects'
]

export function Sidebar() {
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
          <div className="space-y-2">
            {popularSubreddits.map((sub) => (
              <div key={sub.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{sub.icon}</span>
                  <div>
                    <p className="text-sm font-medium">r/{sub.name}</p>
                    <p className="text-xs text-muted-foreground">{sub.members} members</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Join</Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-3 text-accent">
            <Plus className="h-4 w-4 mr-2" />
            Create Community
          </Button>
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