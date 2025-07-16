import { useState, useEffect } from 'react'
import { blink } from '../blink/client'
import { Subreddit } from '../types'

export function useSubreddits() {
  const [subreddits, setSubreddits] = useState<Subreddit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubreddits = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await blink.db.subreddits.list({
        orderBy: { memberCount: 'desc' },
        limit: 20
      })
      
      setSubreddits(result || [])
    } catch (err) {
      console.error('Error fetching subreddits:', err)
      setError('Failed to load subreddits')
    } finally {
      setLoading(false)
    }
  }

  const createSubreddit = async (subredditData: {
    name: string
    displayName: string
    description?: string
  }) => {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const newSubreddit = await blink.db.subreddits.create({
        ...subredditData,
        memberCount: 1,
        createdAt: new Date().toISOString(),
        userId: user.id
      })

      // Auto-join the creator to the subreddit
      await blink.db.userSubredditMemberships.create({
        userId: user.id,
        subredditName: subredditData.name,
        joinedAt: new Date().toISOString()
      })

      setSubreddits(prev => [newSubreddit, ...prev])
      return newSubreddit
    } catch (err) {
      console.error('Error creating subreddit:', err)
      throw err
    }
  }

  const joinSubreddit = async (subredditName: string) => {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      await blink.db.userSubredditMemberships.create({
        userId: user.id,
        subredditName,
        joinedAt: new Date().toISOString()
      })

      // Update member count
      const subreddit = subreddits.find(s => s.name === subredditName)
      if (subreddit) {
        await blink.db.subreddits.update(subreddit.id, {
          memberCount: subreddit.memberCount + 1
        })
        await fetchSubreddits()
      }
    } catch (err) {
      console.error('Error joining subreddit:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchSubreddits()
  }, [])

  return {
    subreddits,
    loading,
    error,
    createSubreddit,
    joinSubreddit,
    refetch: fetchSubreddits
  }
}