import { type NextRequest, NextResponse } from "next/server"
import { aiChatService } from "@/lib/ai-chat-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, userId, previousMessages } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate AI response
    const aiResponse = await aiChatService.generateResponse(message, {
      userId,
      sessionId,
      previousMessages,
    })

    // Store the conversation in our chat system
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      sender: "user" as const,
      timestamp: new Date(),
      sessionId,
    }

    const agentMessage = {
      id: (Date.now() + 1).toString(),
      text: aiResponse.text,
      sender: "agent" as const,
      timestamp: new Date(),
      sessionId,
      metadata: {
        confidence: aiResponse.confidence,
        category: aiResponse.category,
        shouldEscalate: aiResponse.shouldEscalate,
        suggestedActions: aiResponse.suggestedActions,
      },
    }

    // If escalation is needed, create a support ticket
    if (aiResponse.shouldEscalate) {
      // In a real implementation, you would:
      // 1. Create a support ticket in your system
      // 2. Notify human agents
      // 3. Queue for human takeover
      console.log("Escalation needed for session:", sessionId)
    }

    return NextResponse.json({
      userMessage,
      agentMessage,
      shouldEscalate: aiResponse.shouldEscalate,
      suggestedActions: aiResponse.suggestedActions,
    })
  } catch (error) {
    console.error("AI chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

// Streaming endpoint for real-time responses
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const message = searchParams.get("message")
  const sessionId = searchParams.get("sessionId")

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 })
  }

  try {
    const stream = await aiChatService.streamResponse(message, { sessionId: sessionId ?? undefined })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Streaming chat error:", error)
    return NextResponse.json({ error: "Failed to stream response" }, { status: 500 })
  }
}
