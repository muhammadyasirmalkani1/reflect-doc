import { reflectKnowledge } from "./reflect-knowledge-base"
import { reflectSupport } from "./reflect-support"

export interface LiveChatMessage {
  id: string
  text: string
  sender: "user" | "agent" | "system"
  timestamp: Date
  type: "text" | "quick_answer" | "article" | "escalation" | "typing"
  metadata?: {
    confidence?: number
    category?: string
    articleId?: string
    quickAnswerId?: string
    suggestedActions?: string[]
    isEscalated?: boolean
    agentId?: string
  }
}

export interface ChatSession {
  id: string
  userId?: string
  status: "active" | "escalated" | "resolved" | "closed"
  startTime: Date
  lastActivity: Date
  messages: LiveChatMessage[]
  context: {
    userAgent?: string
    referrer?: string
    currentPage?: string
    previousQueries?: string[]
  }
}

export interface LiveAgent {
  id: string
  name: string
  avatar?: string
  status: "online" | "busy" | "away"
  specialties: string[]
  responseTime: number
  satisfaction: number
}

export class LiveChatService {
  private sessions: Map<string, ChatSession> = new Map()
  private agents: LiveAgent[] = [
    {
      id: "agent-sarah",
      name: "Sarah Chen",
      avatar: "👩‍💻",
      status: "online",
      specialties: ["getting-started", "features", "ai-assistant"],
      responseTime: 45,
      satisfaction: 4.9,
    },
    {
      id: "agent-mike",
      name: "Mike Rodriguez",
      avatar: "👨‍💼",
      status: "online",
      specialties: ["billing", "account", "technical"],
      responseTime: 60,
      satisfaction: 4.8,
    },
    {
      id: "agent-emma",
      name: "Emma Thompson",
      avatar: "👩‍🔬",
      status: "busy",
      specialties: ["sync-backup", "integrations", "advanced"],
      responseTime: 90,
      satisfaction: 4.7,
    },
  ]

  async createSession(userId?: string): Promise<ChatSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const session: ChatSession = {
      id: sessionId,
      userId,
      status: "active",
      startTime: new Date(),
      lastActivity: new Date(),
      messages: [],
      context: {
        previousQueries: [],
      },
    }

    this.sessions.set(sessionId, session)

    // Send welcome message
    const welcomeMessage: LiveChatMessage = {
      id: `msg_${Date.now()}`,
      text: `👋 Hi! I'm your Reflect support assistant. I can help you with:

• **Getting started** - Creating notes, basic features
• **Advanced features** - Backlinks, AI assistant, daily notes  
• **Troubleshooting** - Sync issues, technical problems
• **Account & billing** - Plans, payments, settings

What can I help you with today?`,
      sender: "agent",
      timestamp: new Date(),
      type: "text",
      metadata: {
        confidence: 1.0,
        suggestedActions: [
          "How do I create my first note?",
          "Tell me about backlinks",
          "I'm having sync issues",
          "What are the pricing plans?",
        ],
      },
    }

    session.messages.push(welcomeMessage)
    return session
  }

  async sendMessage(
    sessionId: string,
    message: string,
  ): Promise<{
    userMessage: LiveChatMessage
    responses: LiveChatMessage[]
    shouldEscalate: boolean
  }> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error("Session not found")
    }

    // Create user message
    const userMessage: LiveChatMessage = {
      id: `msg_${Date.now()}`,
      text: message,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    }

    session.messages.push(userMessage)
    session.lastActivity = new Date()
    session.context.previousQueries?.push(message)

    // Generate intelligent response
    const responses = await this.generateResponse(message, session)

    // Add responses to session
    responses.forEach((response) => {
      session.messages.push(response)
    })

    // Check if escalation is needed
    const shouldEscalate = responses.some((r) => r.metadata?.isEscalated)
    if (shouldEscalate) {
      session.status = "escalated"
    }

    return {
      userMessage,
      responses,
      shouldEscalate,
    }
  }

  private async generateResponse(message: string, session: ChatSession): Promise<LiveChatMessage[]> {
    const responses: LiveChatMessage[] = []

    // Add typing indicator
    responses.push({
      id: `typing_${Date.now()}`,
      text: "",
      sender: "agent",
      timestamp: new Date(),
      type: "typing",
    })

    // Search knowledge base
    const knowledgeResults = reflectKnowledge.searchKnowledge(message)

    // Get support response
    const supportResponse = reflectSupport.findBestResponse(message)

    // Determine best response strategy
    if (knowledgeResults.confidence > 0.8 && knowledgeResults.quickAnswers.length > 0) {
      // High confidence quick answer
      const quickAnswer = knowledgeResults.quickAnswers[0]

      responses.push({
        id: `msg_${Date.now() + 1}`,
        text: quickAnswer.answer,
        sender: "agent",
        timestamp: new Date(),
        type: "quick_answer",
        metadata: {
          confidence: quickAnswer.confidence,
          category: quickAnswer.category,
          quickAnswerId: quickAnswer.id,
          suggestedActions: quickAnswer.followUpQuestions,
        },
      })

      // Add related articles if available
      if (knowledgeResults.articles.length > 0) {
        const article = knowledgeResults.articles[0]
        responses.push({
          id: `msg_${Date.now() + 2}`,
          text: `📚 **Related Article:** ${article.title}\n\n${article.content.substring(0, 300)}...\n\n*Would you like me to show you the complete article?*`,
          sender: "agent",
          timestamp: new Date(),
          type: "article",
          metadata: {
            articleId: article.id,
            category: article.category,
            suggestedActions: ["Show full article", "Find more articles", "Ask a specific question"],
          },
        })
      }
    } else if (supportResponse.confidence > 0.6) {
      // Use support agent response
      responses.push({
        id: `msg_${Date.now() + 1}`,
        text: supportResponse.response,
        sender: "agent",
        timestamp: new Date(),
        type: "text",
        metadata: {
          confidence: supportResponse.confidence,
          category: supportResponse.topic?.categoryId,
          suggestedActions: supportResponse.followUp,
          isEscalated: supportResponse.escalate,
        },
      })

      // Add escalation if needed
      if (supportResponse.escalate) {
        responses.push(await this.createEscalationMessage(session))
      }
    } else {
      // Low confidence - offer help options
      responses.push({
        id: `msg_${Date.now() + 1}`,
        text: `I want to make sure I give you the most helpful answer. Could you help me understand what you're looking for?

Here are some ways I can help:

🚀 **Getting Started** - First steps with Reflect
✨ **Features** - Backlinks, AI assistant, daily notes
🔧 **Technical Issues** - Sync problems, troubleshooting  
💳 **Billing & Plans** - Pricing, subscriptions, payments
🔐 **Account Help** - Login, security, settings

Or feel free to rephrase your question - I'm here to help!`,
        sender: "agent",
        timestamp: new Date(),
        type: "text",
        metadata: {
          confidence: 0.3,
          suggestedActions: [
            "I need help getting started",
            "I have a technical problem",
            "I have a billing question",
            "Connect me with a human agent",
          ],
        },
      })
    }

    return responses
  }

  private async createEscalationMessage(session: ChatSession): Promise<LiveChatMessage> {
    // Find best available agent
    const availableAgents = this.agents.filter((agent) => agent.status === "online")
    const bestAgent = availableAgents.length > 0 ? availableAgents[0] : null

    if (bestAgent) {
      return {
        id: `msg_${Date.now() + 10}`,
        text: `🤝 I'm connecting you with ${bestAgent.name} ${bestAgent.avatar}, one of our human support specialists.

**${bestAgent.name}** specializes in: ${bestAgent.specialties.join(", ")}
**Average response time:** ${bestAgent.responseTime} seconds
**Customer satisfaction:** ${bestAgent.satisfaction}/5.0 ⭐

They'll be with you shortly to provide personalized assistance!`,
        sender: "system",
        timestamp: new Date(),
        type: "escalation",
        metadata: {
          isEscalated: true,
          agentId: bestAgent.id,
          suggestedActions: ["Wait for agent", "Continue with AI assistant", "Leave a message"],
        },
      }
    } else {
      return {
        id: `msg_${Date.now() + 10}`,
        text: `🎫 All our human agents are currently helping other customers. I've created a priority support ticket for you.

**What happens next:**
• You'll receive an email confirmation shortly
• Our team will respond within 2-4 hours  
• You can continue chatting with me in the meantime

**Ticket ID:** #${session.id.slice(-8).toUpperCase()}

Is there anything else I can help you with while you wait?`,
        sender: "system",
        timestamp: new Date(),
        type: "escalation",
        metadata: {
          isEscalated: true,
          suggestedActions: ["Continue with AI", "Browse help articles", "Check status page"],
        },
      }
    }
  }

  getSession(sessionId: string): ChatSession | undefined {
    return this.sessions.get(sessionId)
  }

  getAvailableAgents(): LiveAgent[] {
    return this.agents.filter((agent) => agent.status === "online")
  }

  async getPopularQuestions(): Promise<string[]> {
    return [
      "How do I create my first note?",
      "What are backlinks and how do I use them?",
      "How does the AI assistant work?",
      "My notes aren't syncing between devices",
      "How much does Reflect cost?",
      "How do I use daily notes?",
      "Can I export my notes?",
      "How do I search my notes effectively?",
      "What's included in the free plan?",
      "How do I upgrade to Pro?",
    ]
  }

  async getBrowseTopics(): Promise<{ [category: string]: string[] }> {
    return {
      "Getting Started": [
        "Creating your first note",
        "Basic navigation and interface",
        "Setting up your account",
        "Installing Reflect apps",
      ],
      "Core Features": [
        "Understanding backlinks",
        "Using the AI assistant",
        "Daily notes and templates",
        "Search and organization",
        "Graph view and connections",
      ],
      "Sync & Backup": [
        "Troubleshooting sync issues",
        "Cross-device synchronization",
        "Data backup and export",
        "Offline access",
      ],
      "Account & Billing": ["Pricing plans comparison", "Upgrading to Pro", "Payment and billing", "Account security"],
      "Advanced Usage": ["Custom templates", "Keyboard shortcuts", "Integrations and API", "Power user tips"],
    }
  }
}

export const liveChatService = new LiveChatService()
