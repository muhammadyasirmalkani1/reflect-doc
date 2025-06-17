export interface KnowledgeArticle {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  lastUpdated: Date
  popularity: number
  helpfulness: number
}

export interface QuickAnswer {
  id: string
  question: string
  answer: string
  category: string
  confidence: number
  followUpQuestions?: string[]
}

export const reflectKnowledgeBase: KnowledgeArticle[] = [
  {
    id: "getting-started-1",
    title: "How to create your first note in Reflect",
    content: `Creating your first note in Reflect is simple and intuitive:

**Quick Start:**
1. Click the "+" button in the top toolbar or press Ctrl/Cmd + N
2. Start typing immediately - no need to save manually
3. Your note is automatically saved as you type

**Pro Tips:**
• Use [[double brackets]] to create links to other notes
• Add #tags to organize your thoughts
• Try @today to create a daily note
• Use markdown formatting (# for headers, * for bullets)

**Advanced Features:**
• The AI assistant can help you write and expand ideas
• Backlinks automatically connect related notes
• Everything syncs across all your devices instantly

Your first note is the beginning of your personal knowledge network!`,
    category: "getting-started",
    tags: ["first note", "create", "new note", "basics"],
    lastUpdated: new Date("2024-01-15"),
    popularity: 95,
    helpfulness: 4.8,
  },
  {
    id: "backlinks-1",
    title: "Understanding and using backlinks effectively",
    content: `Backlinks are Reflect's most powerful feature for connecting ideas:

**What are Backlinks?**
Backlinks are automatic two-way connections between notes. When you link to a note using [[Note Name]], both notes become connected.

**Creating Links:**
• Type [[Note Name]] to link to any note
• If the note doesn't exist, it will be created automatically
• Links appear as clickable blue text

**Viewing Connections:**
• See all backlinks in the right sidebar
• Use the graph view to visualize your knowledge network
• Find related notes through the "Connected Notes" section

**Best Practices:**
• Link liberally - don't overthink it
• Use consistent naming for topics
• Review the graph view regularly to discover patterns
• Create hub notes for major topics

**Advanced Tips:**
• Use block references with [[Note Name#Block]] for specific sections
• Combine with tags for powerful organization
• Let the AI suggest relevant connections

Backlinks transform isolated notes into a powerful, interconnected knowledge system.`,
    category: "features",
    tags: ["backlinks", "connections", "linking", "network"],
    lastUpdated: new Date("2024-01-20"),
    popularity: 88,
    helpfulness: 4.9,
  },
  {
    id: "ai-assistant-1",
    title: "Maximizing your AI assistant capabilities",
    content: `Reflect's AI assistant is your intelligent writing and thinking partner:

**Writing Enhancement:**
• Select text and click the AI button for instant improvements
• Ask for grammar corrections, clarity improvements, or style changes
• Generate outlines, summaries, and expansions of your ideas

**Content Generation:**
• Create meeting agendas and follow-up emails
• Brainstorm ideas and solutions
• Generate templates for recurring note types
• Write in different tones and styles

**Knowledge Management:**
• Ask questions about your notes: "What did I learn about X?"
• Find connections between different topics
• Get suggestions for related content
• Automatically categorize and tag notes

**Smart Commands:**
• "Summarize this note"
• "Find related notes about [topic]"
• "Create an action plan from this meeting"
• "Expand on this idea"

**Privacy & Security:**
• Your notes remain private and secure
• AI processing happens with enterprise-grade security
• No data is used to train external models
• You maintain full control over AI interactions

**Pro Tips:**
• Be specific in your requests for better results
• Use the AI for different perspectives on your ideas
• Combine AI suggestions with your own insights
• Experiment with different prompts and commands

The AI learns your writing style and becomes more helpful over time!`,
    category: "ai-assistant",
    tags: ["ai", "assistant", "writing", "smart features"],
    lastUpdated: new Date("2024-01-18"),
    popularity: 92,
    helpfulness: 4.7,
  },
  {
    id: "sync-troubleshooting-1",
    title: "Resolving sync issues across devices",
    content: `If your notes aren't syncing properly, here's how to fix it:

**Quick Fixes:**
1. Check your internet connection
2. Ensure you're logged into the same account on all devices
3. Force refresh: Ctrl/Cmd + R on desktop, pull down on mobile
4. Check the sync status indicator in the bottom bar

**Common Issues & Solutions:**

**Slow Sync:**
• Large notes or poor connection can cause delays
• Try breaking very large notes into smaller, linked notes
• Check if you're on a metered connection

**Missing Notes:**
• Check if you're in the right workspace
• Look in the "All Notes" view to see everything
• Verify the note wasn't accidentally deleted

**Sync Conflicts:**
• Occurs when editing the same note on multiple devices simultaneously
• Reflect will show both versions - choose which to keep
• Use the version history to recover any lost content

**Advanced Troubleshooting:**
1. Log out and log back in on the problematic device
2. Clear browser cache (web version)
3. Restart the app completely
4. Check Reflect's status page for service issues

**Data Safety:**
• All notes are automatically backed up to the cloud
• Version history preserves all your changes
• Export your data anytime for additional backup

**When to Contact Support:**
• Sync issues persist after trying these steps
• You notice missing or corrupted notes
• Error messages appear during sync

We're here to help ensure your notes are always available when you need them!`,
    category: "sync-backup",
    tags: ["sync", "troubleshooting", "devices", "backup"],
    lastUpdated: new Date("2024-01-22"),
    popularity: 76,
    helpfulness: 4.6,
  },
  {
    id: "daily-notes-1",
    title: "Mastering daily notes for productivity",
    content: `Daily notes are your command center for each day:

**Getting Started:**
• Type @today anywhere to create or link to today's note
• Use Ctrl/Cmd + D for quick access
• Each day automatically gets its own dedicated note

**What to Include:**
• **Morning Planning:** Goals, priorities, schedule
• **Meeting Notes:** Key points, decisions, action items
• **Random Thoughts:** Ideas, insights, observations
• **Daily Reflection:** What went well, what to improve

**Organization Templates:**

**Simple Daily Template:**
\`\`\`
# [[2024-01-23]]

## 🎯 Today's Goals
- [ ] 
- [ ] 
- [ ] 

## 📝 Notes

## 🤝 Meetings

## 💡 Ideas

## 🔄 Tomorrow
\`\`\`

**Advanced Daily Template:**
\`\`\`
# [[2024-01-23]]

## ⚡ Energy Level: 
## 🌤️ Mood: 

## 🎯 Top 3 Priorities
1. [ ] 
2. [ ] 
3. [ ] 

## 📅 Schedule
- 9:00 AM - 
- 10:30 AM - 
- 2:00 PM - 

## 📝 Meeting Notes
### [[Project Alpha Standup]]
- 
- 

## 💡 Random Thoughts
- 

## 📚 Learning
- 

## 🙏 Gratitude
- 
- 
- 

## 🔄 Tomorrow's Setup
- [ ] 
\`\`\`

**Pro Tips:**
• Link to project notes with [[Project Name]]
• Use consistent formatting for easy scanning
• Review previous days to track progress and patterns
• Let the AI help summarize your day or generate action items

**Integration with Other Features:**
• Backlinks automatically connect daily notes to projects
• Use tags like #meeting #idea #todo for organization
• Search across all daily notes to find past discussions
• Create weekly/monthly review notes linking to daily notes

Daily notes become a powerful record of your thinking and progress over time!`,
    category: "features",
    tags: ["daily notes", "productivity", "templates", "organization"],
    lastUpdated: new Date("2024-01-19"),
    popularity: 84,
    helpfulness: 4.8,
  },
]

export const quickAnswers: QuickAnswer[] = [
  {
    id: "qa-1",
    question: "How do I create a new note?",
    answer:
      "Click the '+' button or press Ctrl/Cmd + N to create a new note. Start typing immediately - your note saves automatically!",
    category: "getting-started",
    confidence: 0.95,
    followUpQuestions: ["How do I organize my notes?", "Can I create templates?", "How do backlinks work?"],
  },
  {
    id: "qa-2",
    question: "What are backlinks and how do I use them?",
    answer:
      "Backlinks connect your notes automatically. Type [[Note Name]] to create a link. If the note doesn't exist, it'll be created. This builds your knowledge network!",
    category: "features",
    confidence: 0.92,
    followUpQuestions: [
      "How do I see all my connections?",
      "What's the graph view?",
      "Can I link to specific sections?",
    ],
  },
  {
    id: "qa-3",
    question: "How does the AI assistant work?",
    answer:
      "Select any text and click the AI button, or ask questions about your notes. The AI can help with writing, summarizing, finding connections, and generating ideas while keeping your data private.",
    category: "ai-assistant",
    confidence: 0.9,
    followUpQuestions: ["Is my data safe with AI?", "What AI commands can I use?", "How do I improve AI responses?"],
  },
  {
    id: "qa-4",
    question: "My notes aren't syncing between devices",
    answer:
      "First, check your internet connection and ensure you're logged into the same account. Try refreshing (Ctrl/Cmd + R) or restarting the app. If issues persist, contact support.",
    category: "sync-backup",
    confidence: 0.88,
    followUpQuestions: ["How do I check sync status?", "What if I have sync conflicts?", "How do I backup my notes?"],
  },
  {
    id: "qa-5",
    question: "How much does Reflect cost?",
    answer:
      "Reflect offers a free plan with 1,000 notes and basic features. Reflect Pro is $10/month (or $96/year) with unlimited notes, AI features, and priority support.",
    category: "billing",
    confidence: 0.94,
    followUpQuestions: [
      "What's included in the free plan?",
      "How do I upgrade to Pro?",
      "Is there a student discount?",
    ],
  },
  {
    id: "qa-6",
    question: "How do I use daily notes?",
    answer:
      "Type @today anywhere to create today's note, or press Ctrl/Cmd + D. Use daily notes for planning, meeting notes, and reflections. They automatically link to create a timeline of your thoughts.",
    category: "features",
    confidence: 0.91,
    followUpQuestions: [
      "Can I create daily note templates?",
      "How do I review past days?",
      "What should I include in daily notes?",
    ],
  },
  {
    id: "qa-7",
    question: "Can I export my notes?",
    answer:
      "Yes! Go to Settings > Export to download all your notes in Markdown format. This ensures you always have access to your data and can import it elsewhere if needed.",
    category: "account",
    confidence: 0.89,
    followUpQuestions: ["What formats can I export to?", "How do I import notes?", "Can I backup automatically?"],
  },
  {
    id: "qa-8",
    question: "How do I search my notes effectively?",
    answer:
      "Use Ctrl/Cmd + K for quick search. Search by content, tags (#tag), dates, or note titles. Use quotes for exact phrases and combine terms for precise results.",
    category: "features",
    confidence: 0.87,
    followUpQuestions: ["What are advanced search operators?", "Can I save searches?", "How do I search by date?"],
  },
]

export class ReflectKnowledgeService {
  private articles: KnowledgeArticle[]
  private quickAnswers: QuickAnswer[]

  constructor() {
    this.articles = reflectKnowledgeBase
    this.quickAnswers = quickAnswers
  }

  searchKnowledge(query: string): {
    quickAnswers: QuickAnswer[]
    articles: KnowledgeArticle[]
    confidence: number
  } {
    const normalizedQuery = query.toLowerCase().trim()

    // Find matching quick answers
    const matchingQuickAnswers = this.quickAnswers
      .map((qa) => ({
        ...qa,
        score: this.calculateRelevanceScore(normalizedQuery, qa.question, qa.answer, qa.category),
      }))
      .filter((qa) => qa.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    // Find matching articles
    const matchingArticles = this.articles
      .map((article) => ({
        ...article,
        score: this.calculateRelevanceScore(
          normalizedQuery,
          article.title,
          article.content,
          article.category,
          article.tags,
        ),
      }))
      .filter((article) => article.score > 0.2)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    const overallConfidence = Math.max(matchingQuickAnswers[0]?.score || 0, matchingArticles[0]?.score || 0)

    return {
      quickAnswers: matchingQuickAnswers,
      articles: matchingArticles,
      confidence: overallConfidence,
    }
  }

  private calculateRelevanceScore(
    query: string,
    title: string,
    content: string,
    category: string,
    tags: string[] = [],
  ): number {
    let score = 0
    const queryWords = query.split(" ").filter((word) => word.length > 2)

    // Title matches (highest weight)
    const titleLower = title.toLowerCase()
    queryWords.forEach((word) => {
      if (titleLower.includes(word)) {
        score += 0.4
      }
    })

    // Content matches
    const contentLower = content.toLowerCase()
    queryWords.forEach((word) => {
      const matches = (contentLower.match(new RegExp(word, "g")) || []).length
      score += Math.min(matches * 0.1, 0.3)
    })

    // Category matches
    if (category.toLowerCase().includes(query) || query.includes(category.toLowerCase())) {
      score += 0.2
    }

    // Tag matches
    tags.forEach((tag) => {
      if (tag.toLowerCase().includes(query) || query.includes(tag.toLowerCase())) {
        score += 0.15
      }
    })

    // Exact phrase matches (bonus)
    if (titleLower.includes(query) || contentLower.includes(query)) {
      score += 0.3
    }

    return Math.min(score, 1.0)
  }

  getPopularArticles(limit = 5): KnowledgeArticle[] {
    return this.articles.sort((a, b) => b.popularity - a.popularity).slice(0, limit)
  }

  getArticlesByCategory(category: string): KnowledgeArticle[] {
    return this.articles
      .filter((article) => article.category === category)
      .sort((a, b) => b.helpfulness - a.helpfulness)
  }

  getRelatedArticles(articleId: string, limit = 3): KnowledgeArticle[] {
    const article = this.articles.find((a) => a.id === articleId)
    if (!article) return []

    return this.articles
      .filter((a) => a.id !== articleId && a.category === article.category)
      .sort((a, b) => b.helpfulness - a.helpfulness)
      .slice(0, limit)
  }
}

export const reflectKnowledge = new ReflectKnowledgeService()
