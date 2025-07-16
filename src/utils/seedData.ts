import { blink } from '../blink/client'

export async function seedInitialData() {
  try {
    const user = await blink.auth.me()
    if (!user) return

    // Check if data already exists
    const existingPosts = await blink.db.posts.list({ limit: 1 })
    if (existingPosts.length > 0) return // Data already seeded

    // Create some initial subreddits
    const subreddits = [
      { name: 'programming', displayName: 'Programming', description: 'A community for programmers to share knowledge and discuss coding', memberCount: 1200 },
      { name: 'technology', displayName: 'Technology', description: 'Latest tech news and discussions', memberCount: 1800 },
      { name: 'funny', displayName: 'Funny', description: 'Share your funny stories and memes', memberCount: 3500 },
      { name: 'askreddit', displayName: 'AskReddit', description: 'Ask the Reddit community anything', memberCount: 2800 },
      { name: 'general', displayName: 'General', description: 'General discussions about anything', memberCount: 2100 }
    ]

    for (const sub of subreddits) {
      try {
        await blink.db.subreddits.create({
          ...sub,
          createdAt: new Date().toISOString(),
          userId: user.id
        })
      } catch (error) {
        // Subreddit might already exist, continue
        console.log(`Subreddit ${sub.name} might already exist`)
      }
    }

    // Create some sample posts
    const samplePosts = [
      {
        title: 'Welcome to our Reddit Clone!',
        content: 'This is a fully functional Reddit clone built with React, TypeScript, and the Blink SDK. Feel free to create posts, vote, and explore different communities!',
        subreddit: 'general',
        postType: 'text' as const
      },
      {
        title: 'What\'s your favorite programming language and why?',
        content: 'I\'m curious to hear about everyone\'s favorite programming languages. What makes your choice special?',
        subreddit: 'programming',
        postType: 'text' as const
      },
      {
        title: 'The future of web development',
        content: 'With all the new frameworks and tools coming out, what do you think the future of web development looks like?',
        subreddit: 'technology',
        postType: 'text' as const
      }
    ]

    for (const post of samplePosts) {
      await blink.db.posts.create({
        ...post,
        authorId: user.id,
        authorUsername: user.email?.split('@')[0] || 'admin',
        upvotes: Math.floor(Math.random() * 100) + 10,
        downvotes: Math.floor(Math.random() * 10),
        commentCount: 0,
        createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(), // Random time in last 24h
        updatedAt: new Date().toISOString(),
        userId: user.id
      })
    }

    console.log('Initial data seeded successfully!')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}