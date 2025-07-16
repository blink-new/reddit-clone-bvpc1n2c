export const mockPosts = [
  {
    id: '1',
    title: 'Just built my first React app with TypeScript! Any feedback?',
    content: 'After months of learning, I finally completed my first full-stack application. It\'s a simple todo app but I\'m really proud of it. Used React, TypeScript, and Tailwind CSS. Would love to get some feedback from the community!',
    subreddit: 'programming',
    author: 'newbie_dev',
    upvotes: 1247,
    downvotes: 23,
    commentCount: 89,
    timeAgo: '4 hours ago',
    postType: 'text' as const
  },
  {
    id: '2',
    title: 'The future of AI is here: GPT-4 vs Claude comparison',
    content: '',
    subreddit: 'technology',
    author: 'ai_enthusiast',
    upvotes: 2156,
    downvotes: 145,
    commentCount: 234,
    timeAgo: '6 hours ago',
    postType: 'link' as const,
    url: 'https://example.com/ai-comparison'
  },
  {
    id: '3',
    title: 'My cat discovered the keyboard shortcut for closing tabs',
    content: 'I was working on an important project when my cat walked across my keyboard and somehow managed to close all my browser tabs. I had about 20 research tabs open. Now I have to start over. Thanks, Mr. Whiskers.',
    subreddit: 'funny',
    author: 'cat_owner_123',
    upvotes: 8934,
    downvotes: 234,
    commentCount: 456,
    timeAgo: '8 hours ago',
    postType: 'text' as const
  },
  {
    id: '4',
    title: 'What\'s the most useful programming tip you wish you knew earlier?',
    content: '',
    subreddit: 'askreddit',
    author: 'curious_coder',
    upvotes: 3421,
    downvotes: 89,
    commentCount: 1234,
    timeAgo: '12 hours ago',
    postType: 'text' as const
  },
  {
    id: '5',
    title: 'Beautiful sunset from my office window today',
    content: '',
    subreddit: 'general',
    author: 'nature_lover',
    upvotes: 567,
    downvotes: 12,
    commentCount: 45,
    timeAgo: '1 day ago',
    postType: 'image' as const,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop'
  },
  {
    id: '6',
    title: 'New JavaScript framework claims to be 10x faster than React',
    content: 'A new framework called "LightningJS" has been released claiming unprecedented performance improvements. The benchmarks look impressive, but I\'m skeptical. What do you all think?',
    subreddit: 'programming',
    author: 'js_skeptic',
    upvotes: 892,
    downvotes: 156,
    commentCount: 178,
    timeAgo: '1 day ago',
    postType: 'text' as const
  }
]