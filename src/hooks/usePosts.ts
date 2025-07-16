import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Post } from '../types'

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await blink.db.posts.list({
        orderBy: { createdAt: 'desc' },
        limit: 50
      })
      
      setPosts(result || [])
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

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

      const newPost = await blink.db.posts.create({
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

      setPosts(prev => [newPost, ...prev])
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
    } catch (err) {
      console.error('Error voting on post:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return {
    posts,
    loading,
    error,
    createPost,
    voteOnPost,
    refetch: fetchPosts
  }
}