import { generateText, streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { reflectSupport } from "./reflect-support"

export interface AIResponse {
  text: string
  confidence: number
  shouldEscalate: boolean
  suggestedActions?: string[]
  category?: string
}

export class AIChatService {
  private readonly model = openai("gpt-4o-mini")
  private conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []

  async generateResponse(
    userMessage: string,
    context?: {
      userId?: string
      sessionId?: string
      previousMessages?: Array<{ text: string; sender: "user" | "agent"; timestamp: Date }>
    },
  ): Promise<AIResponse> {
    try {
      // First, try to get a response from our knowledge base
      const supportResponse = reflectSupport.findBestResponse(userMessage)

      // If we have a high-confidence match, use it
      if (supportResponse.confidence > 0.7) {
        return {
          text: supportResponse.response,
          confidence: supportResponse.confidence,
          shouldEscalate: supportResponse.escalate || false,
          suggestedActions: supportResponse.followUp,
          category: supportResponse.topic?.categoryId,
        }
      }

      // Otherwise, use AI to generate a more personalized response
      const systemPrompt = this.buildSystemPrompt()
      const conversationContext = this.buildConversationContext(context?.previousMessages || [])

      const { text } = await generateText({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationContext,
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        maxTokens: 500,
      })

      // Analyze if we should escalate
      const shouldEscalate = this.shouldEscalateToHuman(userMessage, text)

      // Extract suggested actions
      const suggestedActions = this.extractSuggestedActions(text)

      return {
        text: this.formatResponse(text),
        confidence: 0.8,
        shouldEscalate,
        suggestedActions,
        category: this.categorizeMessage(userMessage),
      }
    } catch (error) {
      console.error("AI chat service error:", error)

      // Fallback to knowledge base
      return {
        text: "I'm having trouble processing your request right now. Let me connect you with our support team for immediate assistance.",
        confidence: 0.3,
        shouldEscalate: true,
        suggestedActions: ["Contact human support", "Try again later"],
      }
    }
  }

  async streamResponse(
    userMessage: string,
    context?: {
      userId?: string
      sessionId?: string
      previousMessages?: Array<{ text: string; sender: "user" | "agent"; timestamp: Date }>
    },
  ): Promise<ReadableStream> {
    const systemPrompt = this.buildSystemPrompt()
    const conversationContext = this.buildConversationContext(context?.previousMessages || [])

    const result = await streamText({
      model: this.model,
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationContext,
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      maxTokens: 500,
    })

    return result.toAIStream()
  }

  private buildSystemPrompt(): string {
    return `You are a helpful customer support assistant for Reflect, a note-taking and knowledge management app. 

ABOUT REFLECT:
- AI-powered note-taking with backlinks and connections
- Features: Daily notes, AI assistant, search, sync across devices
- Pricing: Free tier (1,000 notes) and Pro ($10/month, unlimited)
- Platforms: Web, Desktop (Mac/Windows/Linux), Mobile (iOS/Android)

YOUR ROLE:
- Provide helpful, accurate information about Reflect
- Be friendly, professional, and concise
- Offer specific solutions and next steps
- Escalate complex technical issues to human agents
- Use the knowledge base when possible

GUIDELINES:
- Keep responses under 200 words unless detailed explanation needed
- Offer 2-3 specific follow-up actions when helpful
- Use bullet points and formatting for clarity
- If unsure, offer to connect with human support
- Always be encouraging and solution-focused

ESCALATION TRIGGERS:
- Account billing disputes
- Data loss or sync failures
- Complex technical troubleshooting
- Feature requests or bug reports
- Frustrated or angry customers
- Requests outside your knowledge

Remember: You're here to help users succeed with Reflect!`
  }

  private buildConversationContext(
    messages: Array<{ text: string; sender: "user" | "agent"; timestamp: Date }>,
  ): Array<{ role: "user" | "assistant"; content: string }> {
    return messages.slice(-6).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }))
  }

  private shouldEscalateToHuman(userMessage: string, aiResponse: string): boolean {
    const escalationKeywords = [
      "billing",
      "refund",
      "cancel",
      "delete account",
      "data loss",
      "bug",
      "broken",
      "not working",
      "frustrated",
      "angry",
      "speak to human",
      "human agent",
      "manager",
      "supervisor",
    ]

    const message = userMessage.toLowerCase()
    const response = aiResponse.toLowerCase()

    // Check for escalation keywords
    const hasEscalationKeywords = escalationKeywords.some((keyword) => message.includes(keyword))

    // Check if AI response suggests escalation
    const aiSuggestsEscalation =
      response.includes("human support") || response.includes("contact our team") || response.includes("escalate")

    return hasEscalationKeywords || aiSuggestsEscalation
  }

  private extractSuggestedActions(response: string): string[] {
    const actions: string[] = []

    // Look for common action patterns
    const actionPatterns = [
      /try (.*?)(?:\.|$)/gi,
      /you can (.*?)(?:\.|$)/gi,
      /consider (.*?)(?:\.|$)/gi,
      /check (.*?)(?:\.|$)/gi,
    ]

    actionPatterns.forEach((pattern) => {
      const matches = response.match(pattern)
      if (matches) {
        matches.forEach((match) => {
          const action = match.replace(pattern, "$1").trim()
          if (action.length > 10 && action.length < 50) {
            actions.push(action)
          }
        })
      }
    })

    // Add common follow-up actions
    if (response.includes("feature")) {
      actions.push("Learn about Pro features")
    }
    if (response.includes("sync")) {
      actions.push("Check sync status")
    }
    if (response.includes("AI")) {
      actions.push("Try AI assistant")
    }

    return actions.slice(0, 3) // Limit to 3 actions
  }

  private categorizeMessage(message: string): string {
    const categories = {
      "getting-started": ["install", "setup", "first", "begin", "start"],
      features: ["feature", "how to", "backlink", "note", "search"],
      "ai-assistant": ["ai", "assistant", "smart", "help writing"],
      "sync-backup": ["sync", "backup", "device", "cloud"],
      billing: ["price", "cost", "plan", "billing", "payment"],
      technical: ["bug", "error", "broken", "slow", "crash"],
      account: ["login", "password", "account", "security"],
    }

    const lowerMessage = message.toLowerCase()

    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return category
      }
    }

    return "general"
  }

  private formatResponse(text: string): string {
    // Clean up and format the AI response
    let formatted = text.trim()

    // Ensure proper spacing after periods
    formatted = formatted.replace(/\.([A-Z])/g, ". $1")

    // Add emoji for better engagement (sparingly)
    if (formatted.includes("welcome") || formatted.includes("hello")) {
      formatted = "👋 " + formatted
    }

    return formatted
  }

  clearHistory(): void {
    this.conversationHistory = []
  }
}

export const aiChatService = new AIChatService()
