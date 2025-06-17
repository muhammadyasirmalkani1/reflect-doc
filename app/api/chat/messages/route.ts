import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
  sessionId?: string
}

// In a real application, you would store messages in a database
const messages: ChatMessage[] = []
const sessions: Map<string, ChatMessage[]> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, sessionId } = body

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 })
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      sessionId,
    }

    // Store message
    if (sessionId) {
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, [])
      }
      sessions.get(sessionId)?.push(userMessage)
    }
    messages.push(userMessage)

    // Generate agent response (in a real app, this would be more sophisticated)
    const agentResponse = generateAgentResponse(text)
    const agentMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: agentResponse,
      sender: "agent",
      timestamp: new Date(),
      sessionId,
    }

    // Store agent message
    if (sessionId) {
      sessions.get(sessionId)?.push(agentMessage)
    }
    messages.push(agentMessage)

    // In a real application, you might want to:
    // 1. Save to database
    // 2. Send to external chat service
    // 3. Trigger webhooks
    // 4. Send real-time updates via WebSocket

    return NextResponse.json(userMessage)
  } catch (error) {
    console.error("Error processing chat message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (sessionId) {
      const sessionMessages = sessions.get(sessionId) || []
      return NextResponse.json({ messages: sessionMessages })
    }

    // Return recent messages if no session specified
    const recentMessages = messages.slice(-50)
    return NextResponse.json({ messages: recentMessages })
  } catch (error) {
    console.error("Error fetching chat messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateAgentResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()

  if (message.includes("feature") || message.includes("what can")) {
    return "Reflect offers AI-powered note-taking, backlinks, daily notes, and powerful search. Our AI assistant can help you write better, find connections between ideas, and organize your thoughts. Which feature interests you most?"
  }

  if (message.includes("price") || message.includes("cost") || message.includes("plan")) {
    return "We offer flexible pricing with a free tier to get started. Our Pro plan includes unlimited notes, AI features, and priority support starting at $10/month. Would you like to see our detailed pricing?"
  }

  if (message.includes("start") || message.includes("begin") || message.includes("setup")) {
    return "Getting started with Reflect is easy! You can sign up for free and immediately start taking notes. I can guide you through setting up your first notes and connecting ideas. Would you like a quick walkthrough?"
  }

  if (message.includes("ai") || message.includes("assistant")) {
    return "Our AI assistant is one of our most powerful features! It can summarize your notes, suggest related content, help with writing, and even answer questions about your knowledge base. It learns from your notes to provide personalized assistance."
  }

  if (message.includes("help") || message.includes("support") || message.includes("problem")) {
    return "I'm here to help! For technical issues, I can also connect you with our human support team. You can reach us at support@reflect.app or I can escalate this conversation to a specialist. What specific issue are you experiencing?"
  }

  return "Thanks for reaching out! I'm here to help you with any questions about Reflect. I can assist with features, pricing, getting started, or technical support. What would you like to know more about?"
}
