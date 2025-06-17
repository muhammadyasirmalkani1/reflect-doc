import { type NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"

interface ChatSession {
  id: string
  userId?: string
  createdAt: Date
  status: "active" | "closed"
  metadata?: Record<string, any>
}

// In a real application, store sessions in a database
const sessions: Map<string, ChatSession> = new Map()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, metadata } = body

    const session: ChatSession = {
      id: randomUUID(),
      userId,
      createdAt: new Date(),
      status: "active",
      metadata,
    }

    sessions.set(session.id, session)

    return NextResponse.json(session)
  } catch (error) {
    console.error("Error creating chat session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (sessionId) {
      const session = sessions.get(sessionId)
      if (!session) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
      }
      return NextResponse.json(session)
    }

    // Return all sessions (in a real app, you'd paginate and filter by user)
    const allSessions = Array.from(sessions.values())
    return NextResponse.json({ sessions: allSessions })
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
