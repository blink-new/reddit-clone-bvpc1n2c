import { Home, TrendingUp, Clock, Star } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from './ui/tabs'

export function FeedTabs() {
  return (
    <Tabs defaultValue="hot" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="hot" className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4" />
          <span>Hot</span>
        </TabsTrigger>
        <TabsTrigger value="new" className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>New</span>
        </TabsTrigger>
        <TabsTrigger value="top" className="flex items-center space-x-2">
          <Star className="h-4 w-4" />
          <span>Top</span>
        </TabsTrigger>
        <TabsTrigger value="rising" className="flex items-center space-x-2">
          <Home className="h-4 w-4" />
          <span>Rising</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}