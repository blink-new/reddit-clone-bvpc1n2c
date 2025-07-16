import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { FeedTabs } from './components/FeedTabs'
import { PostCard } from './components/PostCard'
import { CreatePostDialog } from './components/CreatePostDialog'
import { usePosts } from './hooks/usePosts'
import { seedInitialData } from './utils/seedData'
import { blink } from './blink/client'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { posts, loading: postsLoading, error: postsError, voteOnPost } = usePosts()

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // Seed initial data when user is authenticated
      if (state.user && !state.isLoading) {
        seedInitialData()
      }
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
              <CreatePostDialog />
            </div>
            
            <div className="mb-6">
              <FeedTabs />
            </div>
            
            {postsError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
                {postsError}
              </div>
            )}
            
            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-card p-6 rounded-lg border animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">Be the first to create a post!</p>
                <CreatePostDialog />
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onVote={voteOnPost} />
                ))}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  )
}

export default App