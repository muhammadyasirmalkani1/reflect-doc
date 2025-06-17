export interface QueuedMessage {
  id: string
  text: string
  sessionId?: string
  timestamp: Date
  retryCount: number
  status: "pending" | "sending" | "sent" | "failed"
}

export class MessageQueue {
  private queue: QueuedMessage[] = []
  private readonly STORAGE_KEY = "reflect-chat-queue"
  private readonly MAX_RETRIES = 3
  private isProcessing = false

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        this.queue = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }))
      }
    } catch (error) {
      console.error("Failed to load message queue from storage:", error)
      this.queue = []
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue))
    } catch (error) {
      console.error("Failed to save message queue to storage:", error)
    }
  }

  addMessage(text: string, sessionId?: string): QueuedMessage {
    const queuedMessage: QueuedMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      sessionId,
      timestamp: new Date(),
      retryCount: 0,
      status: "pending",
    }

    this.queue.push(queuedMessage)
    this.saveToStorage()
    return queuedMessage
  }

  updateMessageStatus(id: string, status: QueuedMessage["status"]) {
    const message = this.queue.find((msg) => msg.id === id)
    if (message) {
      message.status = status
      this.saveToStorage()
    }
  }

  removeMessage(id: string) {
    this.queue = this.queue.filter((msg) => msg.id !== id)
    this.saveToStorage()
  }

  getPendingMessages(): QueuedMessage[] {
    return this.queue.filter((msg) => msg.status === "pending" || msg.status === "failed")
  }

  getFailedMessages(): QueuedMessage[] {
    return this.queue.filter((msg) => msg.status === "failed")
  }

  getAllMessages(): QueuedMessage[] {
    return [...this.queue]
  }

  async processQueue(sendFunction: (text: string, sessionId?: string) => Promise<boolean>): Promise<void> {
    if (this.isProcessing) return

    this.isProcessing = true
    const pendingMessages = this.getPendingMessages()

    for (const message of pendingMessages) {
      if (message.retryCount >= this.MAX_RETRIES) {
        this.updateMessageStatus(message.id, "failed")
        continue
      }

      try {
        this.updateMessageStatus(message.id, "sending")
        const success = await sendFunction(message.text, message.sessionId)

        if (success) {
          this.updateMessageStatus(message.id, "sent")
          // Remove sent messages after a delay to keep them visible briefly
          setTimeout(() => this.removeMessage(message.id), 2000)
        } else {
          message.retryCount++
          this.updateMessageStatus(message.id, message.retryCount >= this.MAX_RETRIES ? "failed" : "pending")
        }
      } catch (error) {
        console.error("Failed to send queued message:", error)
        message.retryCount++
        this.updateMessageStatus(message.id, message.retryCount >= this.MAX_RETRIES ? "failed" : "pending")
      }

      // Add delay between messages to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    this.isProcessing = false
    this.saveToStorage()
  }

  async retryFailedMessage(id: string, sendFunction: (text: string, sessionId?: string) => Promise<boolean>) {
    const message = this.queue.find((msg) => msg.id === id)
    if (!message || message.status !== "failed") return

    try {
      this.updateMessageStatus(id, "sending")
      const success = await sendFunction(message.text, message.sessionId)

      if (success) {
        this.updateMessageStatus(id, "sent")
        setTimeout(() => this.removeMessage(id), 2000)
      } else {
        this.updateMessageStatus(id, "failed")
      }
    } catch (error) {
      console.error("Failed to retry message:", error)
      this.updateMessageStatus(id, "failed")
    }
  }

  clearQueue() {
    this.queue = []
    this.saveToStorage()
  }

  getQueueSize(): number {
    return this.queue.length
  }

  getPendingCount(): number {
    return this.getPendingMessages().length
  }

  getFailedCount(): number {
    return this.getFailedMessages().length
  }
}

export const messageQueue = new MessageQueue()
