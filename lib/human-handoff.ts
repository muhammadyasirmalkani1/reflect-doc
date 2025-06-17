export interface HandoffRequest {
  sessionId: string
  userId?: string
  userEmail?: string
  reason: "escalation" | "user_request" | "complex_issue" | "billing" | "technical"
  context: {
    messages: Array<{ text: string; sender: "user" | "agent"; timestamp: Date }>
    category?: string
    urgency: "low" | "medium" | "high" | "urgent"
  }
  metadata?: Record<string, any>
}

export interface Agent {
  id: string
  name: string
  email: string
  status: "available" | "busy" | "offline"
  specialties: string[]
  currentLoad: number
  maxLoad: number
}

export class HumanHandoffService {
  private agents: Agent[] = [
    {
      id: "agent-1",
      name: "Sarah Chen",
      email: "sarah@reflect.app",
      status: "available",
      specialties: ["technical", "features", "ai-assistant"],
      currentLoad: 2,
      maxLoad: 5,
    },
    {
      id: "agent-2",
      name: "Mike Rodriguez",
      email: "mike@reflect.app",
      status: "available",
      specialties: ["billing", "account", "integrations"],
      currentLoad: 1,
      maxLoad: 4,
    },
    {
      id: "agent-3",
      name: "Emma Thompson",
      email: "emma@reflect.app",
      status: "busy",
      specialties: ["getting-started", "sync-backup", "mobile"],
      currentLoad: 3,
      maxLoad: 3,
    },
  ]

  async requestHandoff(request: HandoffRequest): Promise<{
    success: boolean
    agent?: Agent
    estimatedWaitTime?: number
    ticketId?: string
    message: string
  }> {
    try {
      // Find the best available agent
      const agent = this.findBestAgent(request)

      if (agent) {
        // Assign to agent
        agent.currentLoad++

        // In a real implementation, you would:
        // 1. Send notification to agent
        // 2. Create ticket in support system
        // 3. Set up real-time communication channel

        const ticketId = `REFLECT-${Date.now()}`

        // Simulate agent notification
        await this.notifyAgent(agent, request, ticketId)

        return {
          success: true,
          agent,
          ticketId,
          estimatedWaitTime: 0,
          message: `Great! I'm connecting you with ${agent.name}, who specializes in ${agent.specialties.join(", ")}. They'll be with you shortly.`,
        }
      } else {
        // No agents available - queue the request
        const waitTime = this.estimateWaitTime()
        const ticketId = await this.queueRequest(request)

        return {
          success: true,
          estimatedWaitTime: waitTime,
          ticketId,
          message: `All our agents are currently helping other customers. You're in the queue and the estimated wait time is ${waitTime} minutes. We'll connect you with the next available agent.`,
        }
      }
    } catch (error) {
      console.error("Handoff request failed:", error)
      return {
        success: false,
        message:
          "Sorry, there was an issue connecting you with our support team. Please try again or email us directly at support@reflect.app",
      }
    }
  }

  private findBestAgent(request: HandoffRequest): Agent | null {
    // Filter available agents
    const availableAgents = this.agents.filter(
      (agent) => agent.status === "available" && agent.currentLoad < agent.maxLoad,
    )

    if (availableAgents.length === 0) {
      return null
    }

    // Score agents based on specialties and current load
    const scoredAgents = availableAgents.map((agent) => {
      let score = 0

      // Specialty match bonus
      if (request.context.category && agent.specialties.includes(request.context.category)) {
        score += 10
      }

      // Load penalty (prefer agents with lower load)
      score -= agent.currentLoad * 2

      // Urgency bonus for experienced agents
      if (request.context.urgency === "urgent" && agent.specialties.length > 2) {
        score += 5
      }

      return { agent, score }
    })

    // Sort by score and return best match
    scoredAgents.sort((a, b) => b.score - a.score)
    return scoredAgents[0]?.agent || null
  }

  private async notifyAgent(agent: Agent, request: HandoffRequest, ticketId: string): Promise<void> {
    // In a real implementation, this would:
    // 1. Send email/Slack notification to agent
    // 2. Update agent dashboard
    // 3. Create ticket in support system
    // 4. Set up WebSocket connection for real-time chat

    console.log(`Notifying agent ${agent.name} about new handoff:`, {
      ticketId,
      sessionId: request.sessionId,
      reason: request.reason,
      urgency: request.context.urgency,
    })

    // Simulate API call to support system
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  private estimateWaitTime(): number {
    // Calculate based on current queue and agent availability
    const busyAgents = this.agents.filter((agent) => agent.status === "busy").length
    const totalLoad = this.agents.reduce((sum, agent) => sum + agent.currentLoad, 0)

    // Simple estimation: 5 minutes per queued customer
    return Math.max(5, busyAgents * 5)
  }

  private async queueRequest(request: HandoffRequest): Promise<string> {
    const ticketId = `REFLECT-QUEUE-${Date.now()}`

    // In a real implementation:
    // 1. Add to support queue
    // 2. Send confirmation email
    // 3. Set up periodic status updates

    console.log("Queuing support request:", ticketId)
    return ticketId
  }

  getAgentStatus(): { available: number; busy: number; offline: number } {
    return {
      available: this.agents.filter((a) => a.status === "available" && a.currentLoad < a.maxLoad).length,
      busy: this.agents.filter((a) => a.status === "busy" || a.currentLoad >= a.maxLoad).length,
      offline: this.agents.filter((a) => a.status === "offline").length,
    }
  }

  async updateAgentStatus(agentId: string, status: Agent["status"]): Promise<void> {
    const agent = this.agents.find((a) => a.id === agentId)
    if (agent) {
      agent.status = status
      console.log(`Agent ${agent.name} status updated to: ${status}`)
    }
  }
}

export const humanHandoffService = new HumanHandoffService()
