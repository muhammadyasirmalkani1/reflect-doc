import { chatConfig } from "./chat-config"
import { messageQueue } from "./message-queue"
import { offlineManager, type NetworkStatus } from "./offline-manager"
import { humanHandoffService } from "./human-handoff"

export interface ChatMessage {
  id: string
  text: string
  sender: "user" | "agent"
  timestamp: Date
  status?: "pending" | "sending" | "sent" | "failed"
  queueId?: string
  metadata?: Record<string, any>
}

export interface ChatSession {
  id: string
  userId?: string
  messages: ChatMessage[]
  status: "active" | "closed" | "waiting"
}

export class ChatService {
  private ws: WebSocket | null = null
  private messageHandlers: ((message: ChatMessage) => void)[] = []
  private statusHandlers: ((status: string) => void)[] = []
  private networkHandlers: ((status: NetworkStatus) => void)[] = []
  private queueHandlers: ((queueSize: number) => void)[] = []
  private reconnectAttempts = 0
  private maxReconnectAttempts = 3
  private isConnecting = false

  constructor() {
    this.initializeProvider()
    this.setupOfflineHandling()
  }

  private setupOfflineHandling() {
    // Listen for network status changes
    offlineManager.onStatusChange((status) => {
      console.log("Network status changed:", status)
      this.notifyNetworkHandlers(status)

      if (status === "online") {
        // Process queued messages when back online
        this.processMessageQueue()
      }
    })
  }

  private async processMessageQueue() {
    const pendingCount = messageQueue.getPendingCount()
    if (pendingCount === 0) return

    console.log(`Processing ${pendingCount} queued messages`)

    await messageQueue.processQueue(async (text: string, sessionId?: string) => {
      try {
        const result = await this.sendMessageDirect(text, sessionId)
        return result !== null
      } catch (error) {
        console.error("Failed to send queued message:", error)
        return false
      }
    })

    this.notifyQueueHandlers(messageQueue.getQueueSize())
  }

  private initializeProvider() {
    switch (chatConfig.provider) {
      case "intercom":
        this.initializeIntercom()
        break
      case "zendesk":
        this.initializeZendesk()
        break
      case "custom":
        this.initializeCustom()
        break
      default:
        // Mock provider - no initialization needed
        this.notifyStatusHandlers("connected")
        break
    }
  }

  private initializeIntercom() {
    if (typeof window === "undefined") return

    try {
      const script = document.createElement("script")
      script.src = "https://widget.intercom.io/widget/" + chatConfig.intercom?.appId
      script.async = true
      script.onload = () => {
        this.notifyStatusHandlers("connected")
      }
      script.onerror = () => {
        console.error("Failed to load Intercom")
        this.notifyStatusHandlers("error")
      }
      document.head.appendChild(script)
      ;(window as any).Intercom = (...args: any) => {
        ;(window as any).Intercom.q.push(args)
      }
      ;(window as any).Intercom.q = []
      ;(window as any).Intercom("boot", {
        app_id: chatConfig.intercom?.appId,
        hide_default_launcher: true,
      })
    } catch (error) {
      console.error("Intercom initialization error:", error)
      this.notifyStatusHandlers("error")
    }
  }

  private initializeZendesk() {
    if (typeof window === "undefined") return

    try {
      const script = document.createElement("script")
      script.id = "ze-snippet"
      script.src = `https://static.zdassets.com/ekr/snippet.js?key=${chatConfig.zendesk?.key}`
      script.async = true
      script.onload = () => {
        this.notifyStatusHandlers("connected")
      }
      script.onerror = () => {
        console.error("Failed to load Zendesk")
        this.notifyStatusHandlers("error")
      }
      document.head.appendChild(script)
      ;(window as any).zESettings = {
        webWidget: {
          launcher: {
            chatLabel: {
              "en-US": "Chat with us",
            },
          },
          chat: {
            suppress: true,
          },
        },
      }
    } catch (error) {
      console.error("Zendesk initialization error:", error)
      this.notifyStatusHandlers("error")
    }
  }

  private initializeCustom() {
    if (typeof window === "undefined") return

    if (chatConfig.custom?.enableWebSocket && chatConfig.custom?.websocketUrl) {
      this.connectWebSocket()
    } else {
      this.notifyStatusHandlers("connected")
      console.log("Custom chat initialized with HTTP-only mode")
    }
  }

  private connectWebSocket() {
    if (this.isConnecting || !chatConfig.custom?.websocketUrl) return

    this.isConnecting = true

    try {
      this.ws = new WebSocket(chatConfig.custom.websocketUrl)

      this.ws.onopen = () => {
        console.log("WebSocket connected")
        this.notifyStatusHandlers("connected")
        this.reconnectAttempts = 0
        this.isConnecting = false
      }

      this.ws.onmessage = (event) => {
        try {
          const message: ChatMessage = JSON.parse(event.data)
          this.notifyMessageHandlers(message)
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.ws.onclose = (event) => {
        console.log("WebSocket disconnected", event.code, event.reason)
        this.isConnecting = false

        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.notifyStatusHandlers("reconnecting")
          this.reconnectAttempts++
          setTimeout(() => this.connectWebSocket(), 3000 * this.reconnectAttempts)
        } else {
          this.notifyStatusHandlers("disconnected")
        }
      }

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.isConnecting = false

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          this.notifyStatusHandlers("error")
          console.log("Max reconnection attempts reached. Falling back to HTTP-only mode.")
        } else {
          this.notifyStatusHandlers("error")
        }
      }
    } catch (error) {
      console.error("Failed to initialize WebSocket:", error)
      this.isConnecting = false
      this.notifyStatusHandlers("error")
    }
  }

  async sendMessage(text: string, sessionId?: string): Promise<ChatMessage | null> {
    // Check if we're offline
    if (offlineManager.isOffline()) {
      console.log("Offline: Queuing message")
      const queuedMessage = messageQueue.addMessage(text, sessionId)
      this.notifyQueueHandlers(messageQueue.getQueueSize())

      // Return a chat message with pending status
      return {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
        status: "pending",
        queueId: queuedMessage.id,
      }
    }

    // Try to send immediately if online
    try {
      const result = await this.sendMessageDirect(text, sessionId)
      if (result) {
        result.status = "sent"
      }
      return result
    } catch (error) {
      console.error("Failed to send message, queuing for retry:", error)
      const queuedMessage = messageQueue.addMessage(text, sessionId)
      this.notifyQueueHandlers(messageQueue.getQueueSize())

      return {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
        status: "failed",
        queueId: queuedMessage.id,
      }
    }
  }

  private async sendMessageDirect(text: string, sessionId?: string): Promise<ChatMessage | null> {
    switch (chatConfig.provider) {
      case "intercom":
        return this.sendIntercomMessage(text)
      case "zendesk":
        return this.sendZendeskMessage(text)
      case "custom":
        return this.sendCustomMessage(text, sessionId)
      default:
        return this.sendMockMessage(text)
    }
  }

  private async sendIntercomMessage(text: string): Promise<ChatMessage | null> {
    if (typeof window === "undefined") return null

    try {
      ;(window as any).Intercom("showNewMessage", text)
      return {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
      }
    } catch (error) {
      console.error("Intercom send error:", error)
      throw error
    }
  }

  private async sendZendeskMessage(text: string): Promise<ChatMessage | null> {
    if (typeof window === "undefined") return null

    try {
      ;(window as any).zE("webWidget", "open")
      ;(window as any).zE("webWidget", "chat:send", text)
      return {
        id: Date.now().toString(),
        text,
        sender: "user",
        timestamp: new Date(),
      }
    } catch (error) {
      console.error("Zendesk send error:", error)
      throw error
    }
  }

  private async sendCustomMessage(text: string, sessionId?: string): Promise<ChatMessage | null> {
    try {
      // Use AI service for intelligent responses
      const response = await fetch("/api/chat/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          sessionId,
          previousMessages: this.getRecentMessages(sessionId),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Handle escalation if needed
      if (data.shouldEscalate) {
        setTimeout(() => {
          this.handleEscalation(sessionId, text, data.agentMessage.metadata?.category)
        }, 2000)
      }

      // Notify about agent message
      if (data.agentMessage) {
        setTimeout(() => {
          this.notifyMessageHandlers(data.agentMessage)
        }, 1000)
      }

      return data.userMessage
    } catch (error) {
      console.error("Custom chat error:", error)
      throw error
    }
  }

  private getRecentMessages(sessionId?: string): Array<{ text: string; sender: "user" | "agent"; timestamp: Date }> {
    // Return recent messages for context (implement based on your storage)
    return []
  }

  private async handleEscalation(sessionId?: string, lastMessage?: string, category?: string): Promise<void> {
    try {
      const handoffResult = await humanHandoffService.requestHandoff({
        sessionId: sessionId || "unknown",
        reason: "escalation",
        context: {
          messages: this.getRecentMessages(sessionId),
          category,
          urgency: "medium",
        },
      })

      const escalationMessage: ChatMessage = {
        id: Date.now().toString(),
        text: handoffResult.message,
        sender: "agent",
        timestamp: new Date(),
        metadata: {
          isEscalation: true,
          ticketId: handoffResult.ticketId,
          agent: handoffResult.agent,
        },
      }

      this.notifyMessageHandlers(escalationMessage)
    } catch (error) {
      console.error("Escalation failed:", error)
    }
  }

  private async sendCustomMessageOld(text: string, sessionId?: string): Promise<ChatMessage | null> {
    const response = await fetch(chatConfig.custom?.apiUrl + "/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        sessionId,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const message: ChatMessage = await response.json()
    return message
  }

  private async sendMockMessage(text: string): Promise<ChatMessage | null> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const responses = [
      "Thanks for your message! How can I help you with Reflect today?",
      "I'd be happy to assist you with that. Can you tell me more about what you're looking for?",
      "Great question! Let me help you with information about our features.",
      "I'm here to help! Would you like me to connect you with a human agent for more detailed assistance?",
      "That's a great point! Reflect's AI assistant can definitely help with that. Would you like to know more about our AI features?",
      "I understand your question. Let me provide you with some helpful information about that topic.",
    ]

    const agentMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: responses[Math.floor(Math.random() * responses.length)],
      sender: "agent",
      timestamp: new Date(),
    }

    // Simulate agent response delay
    setTimeout(() => {
      this.notifyMessageHandlers(agentMessage)
    }, 1500)

    return {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    }
  }

  async retryMessage(queueId: string): Promise<void> {
    await messageQueue.retryFailedMessage(queueId, async (text: string, sessionId?: string) => {
      try {
        const result = await this.sendMessageDirect(text, sessionId)
        return result !== null
      } catch (error) {
        console.error("Retry failed:", error)
        return false
      }
    })

    this.notifyQueueHandlers(messageQueue.getQueueSize())
  }

  getQueueStatus() {
    return {
      total: messageQueue.getQueueSize(),
      pending: messageQueue.getPendingCount(),
      failed: messageQueue.getFailedCount(),
    }
  }

  clearMessageQueue() {
    messageQueue.clearQueue()
    this.notifyQueueHandlers(0)
  }

  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler)
  }

  onStatusChange(handler: (status: string) => void) {
    this.statusHandlers.push(handler)
  }

  onNetworkChange(handler: (status: NetworkStatus) => void) {
    this.networkHandlers.push(handler)
  }

  onQueueChange(handler: (queueSize: number) => void) {
    this.queueHandlers.push(handler)
  }

  private notifyMessageHandlers(message: ChatMessage) {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message)
      } catch (error) {
        console.error("Error in message handler:", error)
      }
    })
  }

  private notifyStatusHandlers(status: string) {
    this.statusHandlers.forEach((handler) => {
      try {
        handler(status)
      } catch (error) {
        console.error("Error in status handler:", error)
      }
    })
  }

  private notifyNetworkHandlers(status: NetworkStatus) {
    this.networkHandlers.forEach((handler) => {
      try {
        handler(status)
      } catch (error) {
        console.error("Error in network handler:", error)
      }
    })
  }

  private notifyQueueHandlers(queueSize: number) {
    this.queueHandlers.forEach((handler) => {
      try {
        handler(queueSize)
      } catch (error) {
        console.error("Error in queue handler:", error)
      }
    })
  }

  openChat() {
    try {
      switch (chatConfig.provider) {
        case "intercom":
          if (typeof window !== "undefined") {
            ;(window as any).Intercom("show")
          }
          break
        case "zendesk":
          if (typeof window !== "undefined") {
            ;(window as any).zE("webWidget", "open")
          }
          break
        default:
          break
      }
    } catch (error) {
      console.error("Error opening chat:", error)
    }
  }

  closeChat() {
    try {
      switch (chatConfig.provider) {
        case "intercom":
          if (typeof window !== "undefined") {
            ;(window as any).Intercom("hide")
          }
          break
        case "zendesk":
          if (typeof window !== "undefined") {
            ;(window as any).zE("webWidget", "close")
          }
          break
        default:
          break
      }
    } catch (error) {
      console.error("Error closing chat:", error)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "Client disconnecting")
      this.ws = null
    }
    this.reconnectAttempts = 0
    this.isConnecting = false
  }
}

export const chatService = new ChatService()
