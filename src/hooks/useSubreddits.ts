import { useState, useEffect, useCallback } from 'react'
import { blink } from '../blink/client'
import { Subreddit } from '../types'

// Local fallback data when database is not available
const fallbackSubreddits: Subreddit[] = []

export function useSubreddits() {
  const [subreddits, setSubreddits] = useState<Subreddit[]>(fallbackSubreddits)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  const loadFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('reddit-clone-subreddits')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const saveToLocalStorage = (data: Subreddit[]) => {
    try {
      localStorage.setItem('reddit-clone-subreddits', JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  }

  const fetchSubreddits = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Attempting to fetch subreddits from database...')
      
      const result = await blink.db.subreddits.list({
        orderBy: { memberCount: 'desc' },
        limit: 20
      })
      
      console.log('✅ Successfully fetched subreddits from database:', result)
      setSubreddits(result || [])
      setUseLocalStorage(false)
    } catch (err) {
      console.error('❌ Error fetching subreddits from database:', err)
      
      // Fallback to localStorage
      const localData = loadFromLocalStorage()
      console.log('📦 Loading subreddits from localStorage:', localData)
      setSubreddits(localData)
      setUseLocalStorage(true)
      setError('Using offline mode')
    } finally {
      setLoading(false)
    }
  }, [])

  const createSubreddit = async (subredditData: {
    name: string
    displayName: string
    description?: string
  }) => {
    try {
      const user = await blink.auth.me()
      if (!user) throw new Error('User not authenticated')

      const newSubreddit: Subreddit = {
        id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: subredditData.name,
        displayName: subredditData.displayName,
        description: subredditData.description || '',
        memberCount: 1,
        createdAt: new Date().toISOString(),
        userId: user.id
      }

      if (useLocalStorage) {
        // Save to localStorage
        const updatedSubreddits = [newSubreddit, ...subreddits]
        setSubreddits(updatedSubreddits)
        saveToLocalStorage(updatedSubreddits)
        console.log('✅ Subreddit created and saved to localStorage:', newSubreddit)
      } else {
        // Try to save to database
        try {
          const dbSubreddit = await blink.db.subreddits.create({
            id: newSubreddit.id,
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

          setSubreddits(prev => [dbSubreddit, ...prev])
          console.log('✅ Subreddit created and saved to database:', dbSubreddit)
        } catch (dbError) {
          console.log('❌ Database failed, falling back to localStorage:', dbError)
          // Fallback to localStorage
          const updatedSubreddits = [newSubreddit, ...subreddits]
          setSubreddits(updatedSubreddits)
          saveToLocalStorage(updatedSubreddits)
          setUseLocalStorage(true)
          console.log('✅ Subreddit created and saved to localStorage (fallback):', newSubreddit)
        }
      }

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

      if (useLocalStorage) {
        // Update localStorage
        const updatedSubreddits = subreddits.map(sub => 
          sub.name === subredditName 
            ? { ...sub, memberCount: sub.memberCount + 1 }
            : sub
        )
        setSubreddits(updatedSubreddits)
        saveToLocalStorage(updatedSubreddits)
      } else {
        // Try database operations
        try {
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
        } catch (dbError) {
          // Fallback to localStorage
          const updatedSubreddits = subreddits.map(sub => 
            sub.name === subredditName 
              ? { ...sub, memberCount: sub.memberCount + 1 }
              : sub
          )
          setSubreddits(updatedSubreddits)
          saveToLocalStorage(updatedSubreddits)
          setUseLocalStorage(true)
        }
      }
    } catch (err) {
      console.error('Error joining subreddit:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchSubreddits()
  }, [fetchSubreddits])

  return {
    subreddits,
    loading,
    error,
    createSubreddit,
    joinSubreddit,
    refetch: fetchSubreddits,
    isOffline: useLocalStorage
  }
}