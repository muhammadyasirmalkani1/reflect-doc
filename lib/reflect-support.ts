export interface SupportCategory {
  id: string
  name: string
  description: string
  icon: string
}

export interface SupportTopic {
  id: string
  categoryId: string
  title: string
  keywords: string[]
  response: string
  followUp?: string[]
  escalate?: boolean
}

export interface SupportTicket {
  id: string
  userId?: string
  email?: string
  subject: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: Date
  updatedAt: Date
}

export const supportCategories: SupportCategory[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Setup, installation, and first steps",
    icon: "🚀",
  },
  {
    id: "features",
    name: "Features & Usage",
    description: "How to use Reflect's features",
    icon: "✨",
  },
  {
    id: "ai-assistant",
    name: "AI Assistant",
    description: "AI-powered features and capabilities",
    icon: "🤖",
  },
  {
    id: "sync-backup",
    name: "Sync & Backup",
    description: "Data synchronization and backup",
    icon: "☁️",
  },
  {
    id: "billing",
    name: "Billing & Plans",
    description: "Subscriptions, payments, and pricing",
    icon: "💳",
  },
  {
    id: "technical",
    name: "Technical Issues",
    description: "Bugs, performance, and troubleshooting",
    icon: "🔧",
  },
  {
    id: "account",
    name: "Account & Security",
    description: "Login, passwords, and account settings",
    icon: "🔐",
  },
  {
    id: "integrations",
    name: "Integrations",
    description: "Third-party apps and connections",
    icon: "🔗",
  },
]

export const supportTopics: SupportTopic[] = [
  // Getting Started
  {
    id: "install-app",
    categoryId: "getting-started",
    title: "How to install Reflect",
    keywords: ["install", "download", "setup", "app", "desktop", "mobile"],
    response: `You can install Reflect on multiple platforms:

**Desktop:**
• macOS: Download from our website or Mac App Store
• Windows: Download from our website or Microsoft Store
• Linux: Available as AppImage or Snap package

**Mobile:**
• iOS: Download from the App Store
• Android: Download from Google Play Store

**Web:**
• Access directly at app.reflect.app in any modern browser

Would you like specific installation instructions for your platform?`,
    followUp: ["What platform are you using?", "Need help with the setup process?"],
  },
  {
    id: "first-note",
    categoryId: "getting-started",
    title: "Creating your first note",
    keywords: ["first note", "create", "new note", "start", "begin"],
    response: `Creating your first note in Reflect is simple:

1. **Click the "+" button** or press Ctrl/Cmd + N
2. **Start typing** - no need to save, it's automatic
3. **Use [[double brackets]]** to create links to other notes
4. **Add #tags** to organize your thoughts
5. **Try @today** to create a daily note

**Pro Tips:**
• Use markdown formatting (# for headers, * for bullets)
• The AI assistant can help you write and organize
• Everything syncs automatically across your devices

Would you like me to explain any of these features in more detail?`,
    followUp: ["Tell me about backlinks", "How does the AI assistant work?", "Explain daily notes"],
  },

  // Features & Usage
  {
    id: "backlinks",
    categoryId: "features",
    title: "Understanding backlinks",
    keywords: ["backlinks", "links", "connections", "[[", "linking", "network"],
    response: `Backlinks are one of Reflect's most powerful features:

**Creating Links:**
• Type [[Note Name]] to link to any note
• If the note doesn't exist, it will be created
• Links appear as clickable text in your notes

**Viewing Connections:**
• See all backlinks in the right sidebar
• Use the graph view to visualize connections
• Find related notes automatically

**Smart Features:**
• Automatic link suggestions as you type
• Unlinked mentions detection
• Bidirectional linking (links work both ways)

**Best Practices:**
• Link liberally - don't overthink it
• Use consistent naming for topics
• Review the graph view regularly to discover patterns

This creates a powerful knowledge network that grows more valuable over time!`,
    followUp: ["Show me the graph view", "How do I organize my notes?", "Tell me about tags"],
  },
  {
    id: "daily-notes",
    categoryId: "features",
    title: "Using daily notes",
    keywords: ["daily notes", "@today", "journal", "daily", "today"],
    response: `Daily notes help you capture thoughts and organize your day:

**Creating Daily Notes:**
• Type @today anywhere to create/link to today's note
• Use Ctrl/Cmd + D for quick access
• Each day gets its own dedicated note

**What to Include:**
• Meeting notes and action items
• Random thoughts and ideas
• Daily reflections and planning
• Links to other relevant notes

**Organization Tips:**
• Use consistent templates (meetings, tasks, notes)
• Link to project notes with [[Project Name]]
• Review previous days to track progress
• Use tags like #meeting #idea #todo

**AI Integration:**
• Ask AI to summarize your day
• Generate action items from meeting notes
• Create follow-up reminders

Daily notes become a powerful record of your thinking over time!`,
    followUp: ["How do I create templates?", "Tell me about AI features", "Show me task management"],
  },

  // AI Assistant
  {
    id: "ai-features",
    categoryId: "ai-assistant",
    title: "AI Assistant capabilities",
    keywords: ["ai", "assistant", "artificial intelligence", "smart", "help", "gpt"],
    response: `Reflect's AI assistant is your intelligent writing and thinking partner:

**Writing Help:**
• Improve grammar and clarity
• Expand on ideas and concepts
• Generate outlines and structures
• Suggest better word choices

**Content Generation:**
• Create summaries of long notes
• Generate meeting agendas
• Write follow-up emails
• Brainstorm ideas and solutions

**Knowledge Management:**
• Find connections between notes
• Suggest related content
• Answer questions about your notes
• Create automatic tags and categories

**How to Use:**
• Select text and click the AI button
• Type questions in natural language
• Use AI commands like "summarize this"
• Ask for help with specific tasks

**Privacy:**
• Your notes stay private and secure
• AI processing happens securely
• No data is used to train models
• Full control over AI interactions

The AI learns your writing style and becomes more helpful over time!`,
    followUp: ["How do I ask the AI questions?", "Is my data private?", "Show me AI commands"],
  },

  // Sync & Backup
  {
    id: "sync-issues",
    categoryId: "sync-backup",
    title: "Sync troubleshooting",
    keywords: ["sync", "synchronization", "not syncing", "backup", "cloud", "devices"],
    response: `If you're experiencing sync issues, here are common solutions:

**Check Connection:**
• Ensure you're connected to the internet
• Verify you're logged into the same account on all devices
• Check if Reflect servers are operational

**Force Sync:**
• Pull down on mobile to refresh
• Use Ctrl/Cmd + R on desktop to reload
• Check the sync status indicator

**Common Issues:**
• **Slow sync:** Large notes or poor connection
• **Conflicts:** Editing same note on multiple devices
• **Missing notes:** Check if they're in a different workspace

**Troubleshooting Steps:**
1. Log out and log back in
2. Check your internet connection
3. Restart the app
4. Contact support if issues persist

**Data Safety:**
• All notes are automatically backed up
• Version history preserves your changes
• Export options available for peace of mind

Need help with a specific sync issue?`,
    followUp: ["My notes aren't appearing", "How do I export my data?", "Contact human support"],
    escalate: true,
  },

  // Billing
  {
    id: "pricing-plans",
    categoryId: "billing",
    title: "Pricing and plans",
    keywords: ["pricing", "plans", "cost", "subscription", "free", "pro", "premium"],
    response: `Reflect offers flexible pricing to fit your needs:

**Free Plan:**
• 1,000 notes and uploads
• Basic features and sync
• Perfect for getting started

**Reflect Pro ($10/month):**
• Unlimited notes and uploads
• AI assistant features
• Advanced search and filters
• Priority support
• Early access to new features

**Annual Discount:**
• Save 20% with annual billing
• Pro plan: $96/year (2 months free)

**Features Comparison:**
• Free: Core note-taking and basic sync
• Pro: AI features, unlimited storage, advanced tools

**Billing:**
• Secure payment processing
• Cancel anytime, no long-term commitment
• Prorated refunds available

**Student Discount:**
• 50% off Pro plan with valid student email
• Verify your student status during signup

Ready to upgrade or have billing questions?`,
    followUp: ["How do I upgrade?", "Student discount info", "Billing support"],
  },

  // Technical Issues
  {
    id: "performance-issues",
    categoryId: "technical",
    title: "Performance and speed issues",
    keywords: ["slow", "performance", "lag", "speed", "loading", "freezing", "crash"],
    response: `Let's get Reflect running smoothly again:

**Quick Fixes:**
• Restart the app completely
• Check available storage space
• Close other resource-heavy applications
• Update to the latest version

**Performance Optimization:**
• **Large notes:** Break into smaller, linked notes
• **Many images:** Compress or reduce image sizes
• **Sync issues:** Check internet connection speed
• **Memory usage:** Restart app periodically

**Platform-Specific:**
• **Desktop:** Check system requirements
• **Mobile:** Close background apps
• **Web:** Try a different browser or incognito mode

**System Requirements:**
• **macOS:** 10.14 or later
• **Windows:** Windows 10 or later
• **iOS:** iOS 14 or later
• **Android:** Android 8.0 or later

**Still Having Issues?**
Please share:
• Your device and operating system
• When the issue started
• Specific actions that trigger the problem
• Any error messages you see

I can escalate to our technical team for further assistance.`,
    followUp: ["Share system details", "Contact technical support", "Report a bug"],
    escalate: true,
  },

  // Account & Security
  {
    id: "account-security",
    categoryId: "account",
    title: "Account security and login",
    keywords: ["login", "password", "security", "account", "forgot", "reset", "2fa", "authentication"],
    response: `Keeping your Reflect account secure:

**Login Issues:**
• **Forgot password:** Use the reset link on login page
• **Account locked:** Wait 15 minutes or contact support
• **Wrong email:** Check for typos or alternate emails

**Security Features:**
• **Two-factor authentication:** Enable in account settings
• **Strong passwords:** Use unique, complex passwords
• **Login notifications:** Get alerts for new device logins
• **Session management:** View and revoke active sessions

**Account Settings:**
• Update email and password anytime
• Manage connected devices
• Review login history
• Export account data

**Privacy & Security:**
• End-to-end encryption for your notes
• Zero-knowledge architecture
• GDPR and privacy law compliant
• Regular security audits

**Need Help?**
• Reset password: Use the forgot password link
• Enable 2FA: Go to Settings > Security
• Account issues: Contact support with your email

Your data security is our top priority!`,
    followUp: ["Reset my password", "Enable two-factor auth", "Account security help"],
  },
]

export class ReflectSupportAgent {
  private topics: SupportTopic[]
  private categories: SupportCategory[]

  constructor() {
    this.topics = supportTopics
    this.categories = supportCategories
  }

  findBestResponse(userMessage: string): {
    response: string
    topic?: SupportTopic
    confidence: number
    followUp?: string[]
    escalate?: boolean
  } {
    const message = userMessage.toLowerCase()
    let bestMatch: SupportTopic | null = null
    let bestScore = 0

    // Find the best matching topic
    for (const topic of this.topics) {
      let score = 0

      // Check keywords
      for (const keyword of topic.keywords) {
        if (message.includes(keyword.toLowerCase())) {
          score += keyword.length // Longer keywords get higher scores
        }
      }

      // Check title words
      const titleWords = topic.title.toLowerCase().split(" ")
      for (const word of titleWords) {
        if (message.includes(word)) {
          score += word.length * 0.5
        }
      }

      if (score > bestScore) {
        bestScore = score
        bestMatch = topic
      }
    }

    // If we found a good match
    if (bestMatch && bestScore > 3) {
      return {
        response: bestMatch.response,
        topic: bestMatch,
        confidence: Math.min(bestScore / 10, 1),
        followUp: bestMatch.followUp,
        escalate: bestMatch.escalate,
      }
    }

    // Fallback responses based on general categories
    if (message.includes("help") || message.includes("support")) {
      return {
        response: this.getGeneralHelpResponse(),
        confidence: 0.3,
        followUp: ["Browse help topics", "Contact human support", "Search documentation"],
      }
    }

    // Default response
    return {
      response: this.getDefaultResponse(),
      confidence: 0.1,
      followUp: ["Browse help topics", "Contact human support", "Try rephrasing your question"],
    }
  }

  private getGeneralHelpResponse(): string {
    return `I'm here to help you with Reflect! I can assist with:

🚀 **Getting Started** - Installation, setup, first steps
✨ **Features** - Note-taking, backlinks, organization
🤖 **AI Assistant** - Smart features and capabilities
☁️ **Sync & Backup** - Data synchronization across devices
💳 **Billing** - Plans, pricing, and subscriptions
🔧 **Technical Issues** - Troubleshooting and bug reports
🔐 **Account & Security** - Login, passwords, privacy
🔗 **Integrations** - Third-party apps and connections

What would you like help with today? You can ask me specific questions or browse the topics above.`
  }

  private getDefaultResponse(): string {
    return `I'd be happy to help you with Reflect! I didn't quite understand your question, but I can assist with:

• **Getting started** with Reflect
• **Using features** like backlinks and AI
• **Troubleshooting** technical issues
• **Account and billing** questions
• **Sync and backup** problems

Could you rephrase your question or let me know which topic you'd like help with?

For complex issues, I can also connect you with our human support team.`
  }

  getCategoriesOverview(): string {
    return `Here are the main areas I can help you with:

${this.categories.map((cat) => `${cat.icon} **${cat.name}**\n   ${cat.description}`).join("\n\n")}

What would you like to explore? Just ask me about any of these topics!`
  }

  async createSupportTicket(ticket: Omit<SupportTicket, "id" | "createdAt" | "updatedAt">): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // In a real implementation, this would save to a database
    console.log("Support ticket created:", newTicket)

    return newTicket
  }

  getEscalationMessage(): string {
    return `I'd be happy to connect you with our human support team for personalized assistance.

**What happens next:**
1. I'll create a support ticket with your question
2. Our team will review your case within 2-4 hours
3. You'll receive a response via email
4. For urgent issues, we also offer live chat during business hours

**Business Hours:**
• Monday-Friday: 9 AM - 6 PM PST
• Response time: Usually within 2-4 hours
• Emergency support: Available for Pro users

Would you like me to create a support ticket for you?`
  }
}

export const reflectSupport = new ReflectSupportAgent()
