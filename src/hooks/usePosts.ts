import { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { Post } from '../types'

// Local fallback data when database is not available
const fallbackPosts: Post[] = []

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(fallbackPosts)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('reddit-clone-posts')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveToLocalStorage = (data: Post[]) => {
    try {
      localStorage.setItem('reddit-clone-posts', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await blink.db.posts.list({
        orderBy: { createdAt: 'desc' },
        limit: 50
      })
      
      setPosts(result || [])
      setUseLocalStorage(false)
    } catch (err) {
      console.error('Error fetching posts:', err)
      
      // Fallback to localStorage
      const localData = loadFromLocalStorage()
      setPosts(localData)
      setUseLocalStorage(true)
      setError('Using offline mode')
    } finally {
      setLoading(false)
    }
  }, [])

  const createPost = async (postData: {
    title: string
    content?: string
    subreddit: string
    postType: 'text' | 'link' | 'image'
    url?: string
    imageUrl?: string
  }) => {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const newPost: Post = {
        id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: postData.title,
        content: postData.content || '',
        subreddit: postData.subreddit,
        postType: postData.postType,
        url: postData.url,
        imageUrl: postData.imageUrl,
        authorId: user.id,
        authorUsername: user.email?.split('@')[0] || 'anonymous',
        upvotes: 0,
        downvotes: 0,
        commentCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: user.id
      }

      if (useLocalStorage) {
        // Save to localStorage
        const updatedPosts = [newPost, ...posts]
        setPosts(updatedPosts)
        saveToLocalStorage(updatedPosts)
      } else {
        // Try to save to database
        try {
          const dbPost = await blink.db.posts.create({
            ...postData,
            authorId: user.id,
            authorUsername: user.email?.split('@')[0] || 'anonymous',
            upvotes: 0,
            downvotes: 0,
            commentCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: user.id
          })

          setPosts(prev => [dbPost, ...prev])
        } catch (dbError) {
          // Fallback to localStorage
          const updatedPosts = [newPost, ...posts]
          setPosts(updatedPosts)
          saveToLocalStorage(updatedPosts)
          setUseLocalStorage(true)
        }
      }

      return newPost
    } catch (err) {
      console.error('Error creating post:', err)
      throw err
    }
  }

  const voteOnPost = async (postId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      if (useLocalStorage) {
        // Update localStorage
        const updatedPosts = posts.map(post => {
          if (post.id === postId) {
            const currentUpvotes = post.upvotes || 0
            const currentDownvotes = post.downvotes || 0
            
            if (voteType === 'upvote') {
              return { ...post, upvotes: currentUpvotes + 1 }
            } else {
              return { ...post, downvotes: currentDownvotes + 1 }
            }
          }
          return post
        })
        setPosts(updatedPosts)
        saveToLocalStorage(updatedPosts)
      } else {
        // Try database operations
        try {
          // Check if user already voted
          const existingVotes = await blink.db.votes.list({
            where: { userId: user.id, postId }
          })

          if (existingVotes.length > 0) {
            const existingVote = existingVotes[0]
            if (existingVote.voteType === voteType) {
              // Remove vote if clicking same vote
              await blink.db.votes.delete(existingVote.id)
            } else {
              // Update vote type
              await blink.db.votes.update(existingVote.id, { voteType })
            }
          } else {
            // Create new vote
            await blink.db.votes.create({
              userId: user.id,
              postId,
              voteType,
              createdAt: new Date().toISOString()
            })
          }

          // Refresh posts to get updated vote counts
          await fetchPosts()
        } catch (dbError) {
          // Fallback to localStorage
          const updatedPosts = posts.map(post => {
            if (post.id === postId) {
              const currentUpvotes = post.upvotes || 0
              const currentDownvotes = post.downvotes || 0
              
              if (voteType === 'upvote') {
                return { ...post, upvotes: currentUpvotes + 1 }
              } else {
                return { ...post, downvotes: currentDownvotes + 1 }
              }
            }
            return post
          })
          setPosts(updatedPosts)
          saveToLocalStorage(updatedPosts)
          setUseLocalStorage(true)
        }
      }
    } catch (err) {
      console.error('Error voting on post:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return {
    posts,
    loading,
    error,
    createPost,
    voteOnPost,
    refetch: fetchPosts,
    isOffline: useLocalStorage
  }
}