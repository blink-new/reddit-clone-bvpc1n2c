import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { FeedTabs } from './components/FeedTabs'
import { PostCard } from './components/PostCard'
import { mockPosts } from './data/mockData'
import { blink } from './blink/client'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-sm">R</span>
          </div>
          <p className="text-muted-foreground">Loading Reddit...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
            <span className="text-primary-foreground font-bold text-2xl">R</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome to Reddit</h1>
          <p className="text-muted-foreground mb-6">
            Join the community and discover amazing content from around the world.
          </p>
          <button 
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Main Content */}
          <main className="flex-1 max-w-2xl">
            <div className="mb-6">
              <FeedTabs />
            </div>
            
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

export default App