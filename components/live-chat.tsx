"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  X,
  Send,
  Bot,
  User,
  Wifi,
  WifiOff,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trash2,
  HelpCircle,
  Headphones,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { chatService, type ChatMessage } from "@/lib/chat-service"
import { chatConfig } from "@/lib/chat-config"
import { reflectSupport } from "@/lib/reflect-support"
import { SupportTicketForm } from "./support-ticket-form"
import type { NetworkStatus } from "@/lib/offline-manager"

type ConnectionStatus = "connected" | "disconnected" | "reconnecting" | "error"
type ChatMode = "chat" | "support-form" | "categories"

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatMode, setChatMode] = useState<ChatMode>("chat")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connected")
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>("online")
  const [queueSize, setQueueSize] = useState(0)
  const [sessionId, setSessionId] = useState<string>()
  const [showQuickActions, setShowQuickActions] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [isEscalated, setIsEscalated] = useState(false)
  const [assignedAgent, setAssignedAgent] = useState<string>()
  const [ticketId, setTicketId] = useState<string>()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize chat session for custom provider
    const initializeSession = async () => {
      if (chatConfig.provider === "custom") {
        try {
          const response = await fetch("/api/chat/sessions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ metadata: { source: "website" } }),
          })

          if (response.ok) {
            const session = await response.json()
            setSessionId(session.id)
          }
        } catch (error) {
          console.error("Failed to create chat session:", error)
        }
      }
    }

    initializeSession()

    // Set up event handlers
    const handleMessage = (message: ChatMessage) => {
      setMessages((prev) => [...prev, message])
      setIsTyping(false)

      // Check for escalation
      if (message.metadata?.isEscalation) {
        setIsEscalated(true)
        setAssignedAgent(message.metadata.agent?.name)
        setTicketId(message.metadata.ticketId)
      }
    }

    const handleStatus = (status: string) => {
      setConnectionStatus(status as ConnectionStatus)
    }

    const handleNetworkChange = (status: NetworkStatus) => {
      setNetworkStatus(status)
    }

    const handleQueueChange = (size: number) => {
      setQueueSize(size)
    }

    chatService.onMessage(handleMessage)
    chatService.onStatusChange(handleStatus)
    chatService.onNetworkChange(handleNetworkChange)
    chatService.onQueueChange(handleQueueChange)

    return () => {
      chatService.disconnect()
    }
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        text: getWelcomeMessage(),
        sender: "agent",
        timestamp: new Date(),
        status: "sent",
      }
      setMessages([welcomeMessage])
      setShowQuickActions(true)
    }
  }, [isOpen, messages.length])

  const getWelcomeMessage = () => {
    return `👋 Hi! I'm your Reflect support assistant. I can help you with:

• Getting started with Reflect
• Using features like backlinks and AI
• Troubleshooting technical issues
• Account and billing questions
• Sync and backup problems

What can I help you with today?`
  }

  const getStatusInfo = () => {
    if (networkStatus === "offline") {
      return {
        icon: WifiOff,
        text: "Offline",
        color: "bg-orange-500/20 text-orange-700 dark:text-orange-300",
      }
    }

    switch (connectionStatus) {
      case "connected":
        return { icon: Wifi, text: "Online", color: "bg-green-500/20 text-green-700 dark:text-green-300" }
      case "reconnecting":
        return {
          icon: AlertCircle,
          text: "Reconnecting",
          color: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
        }
      case "error":
        return { icon: WifiOff, text: "Connection Error", color: "bg-red-500/20 text-red-700 dark:text-red-300" }
      default:
        return { icon: WifiOff, text: "Offline", color: "bg-gray-500/20 text-gray-700 dark:text-gray-300" }
    }
  }

  const getMessageStatusIcon = (message: ChatMessage) => {
    switch (message.status) {
      case "pending":
        return <Clock className="h-3 w-3 text-yellow-500" />
      case "sending":
        return <AlertCircle className="h-3 w-3 text-blue-500 animate-spin" />
      case "sent":
        return <CheckCircle className="h-3 w-3 text-green-500" />
      case "failed":
        return <XCircle className="h-3 w-3 text-red-500" />
      default:
        return null
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      status: networkStatus === "offline" ? "pending" : "sending",
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)
    setShowQuickActions(false)

    try {
      // Use Reflect support agent for intelligent responses
      const supportResponse = reflectSupport.findBestResponse(inputValue)

      // Simulate typing delay
      setTimeout(() => {
        const agentMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: supportResponse.response,
          sender: "agent",
          timestamp: new Date(),
          status: "sent",
        }

        setMessages((prev) => [...prev, agentMessage])
        setIsTyping(false)

        // Add follow-up actions if available
        if (supportResponse.followUp && supportResponse.followUp.length > 0) {
          setTimeout(() => {
            const followUpMessage: ChatMessage = {
              id: (Date.now() + 2).toString(),
              text: `Here are some related topics that might help:\n\n${supportResponse.followUp
                ?.map((item, index) => `${index + 1}. ${item}`)
                .join("\n")}`,
              sender: "agent",
              timestamp: new Date(),
              status: "sent",
            }
            setMessages((prev) => [...prev, followUpMessage])
          }, 1000)
        }

        // Offer escalation if needed
        if (supportResponse.escalate) {
          setTimeout(() => {
            const escalationMessage: ChatMessage = {
              id: (Date.now() + 3).toString(),
              text: "Would you like me to connect you with our human support team for more detailed assistance?",
              sender: "agent",
              timestamp: new Date(),
              status: "sent",
            }
            setMessages((prev) => [...prev, escalationMessage])
          }, 2000)
        }
      }, 1500)

      // Update user message status
      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "sent" } : msg)))
    } catch (error) {
      console.error("Failed to send message:", error)
      setIsTyping(false)

      setMessages((prev) => prev.map((msg) => (msg.id === userMessage.id ? { ...msg, status: "failed" } : msg)))

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble processing your message right now. Please try again or contact our support team directly at support@reflect.app",
        sender: "agent",
        timestamp: new Date(),
        status: "sent",
      }
      setMessages((prev) => [...prev, errorMessage])
    }
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    setShowQuickActions(false)
  }

  const handleSupportTicket = (ticketData: any) => {
    // In a real implementation, this would submit to your support system
    console.log("Support ticket submitted:", ticketData)

    const confirmationMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `✅ Support ticket created successfully!

**Ticket Details:**
• Category: ${ticketData.category}
• Priority: ${ticketData.priority}
• Subject: ${ticketData.subject}

Our team will review your request and respond within 2-4 hours. You'll receive updates at ${ticketData.email}.

**What's next:**
1. Check your email for ticket confirmation
2. Our team will investigate your issue
3. You'll receive a detailed response
4. Follow-up support available as needed

Is there anything else I can help you with today?`,
      sender: "agent",
      timestamp: new Date(),
      status: "sent",
    }

    setMessages((prev) => [...prev, confirmationMessage])
    setChatMode("chat")
  }

  const handleRetryMessage = async (message: ChatMessage) => {
    if (!message.queueId) return

    setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "sending" } : msg)))

    try {
      await chatService.retryMessage(message.queueId)
    } catch (error) {
      console.error("Failed to retry message:", error)
      setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, status: "failed" } : msg)))
    }
  }

  const handleClearQueue = () => {
    chatService.clearMessageQueue()
    setMessages((prev) => prev.filter((msg) => msg.status !== "pending" && msg.status !== "failed"))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleToggleChat = () => {
    if (chatConfig.provider === "intercom" || chatConfig.provider === "zendesk") {
      if (isOpen) {
        chatService.closeChat()
      } else {
        chatService.openChat()
      }
    }
    setIsOpen(!isOpen)
  }

  const showCustomInterface = chatConfig.provider === "custom" || chatConfig.provider === "mock"
  const statusInfo = getStatusInfo()
  const StatusIcon = statusInfo.icon
  const queueStatus = chatService.getQueueStatus()

  const quickActions = [
    "How do I create my first note?",
    "Tell me about backlinks",
    "How does the AI assistant work?",
    "I'm having sync issues",
    "What are the pricing plans?",
    "Contact human support",
  ]

  return (
    <>
      {/* Chat Toggle Button with Queue Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        {queueSize > 0 && (
          <Badge className="absolute -top-2 -left-2 bg-orange-500 text-white border-0 min-w-[20px] h-5 flex items-center justify-center text-xs">
            {queueSize}
          </Badge>
        )}
        <Button
          onClick={handleToggleChat}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
            "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
            "border-0 text-white hover:scale-110",
            isOpen && "rotate-180",
          )}
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Headphones className="h-6 w-6" />}
        </Button>
      </div>

      {/* Custom Chat Window */}
      {isOpen && showCustomInterface && (
        <Card
          className={cn(
            "fixed bottom-24 right-6 z-40 w-80 h-96 shadow-2xl transition-all duration-300",
            "border-purple-200 dark:border-purple-800",
            "animate-in slide-in-from-bottom-4 fade-in-0",
          )}
        >
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5" />
              Reflect Support
              <div className="ml-auto flex items-center gap-2">
                <StatusIcon className="h-4 w-4" />
                <Badge variant="secondary" className={cn("border-0", statusInfo.color)}>
                  {statusInfo.text}
                </Badge>
              </div>
            </CardTitle>
            {isEscalated && (
              <div className="flex items-center gap-2 text-xs bg-green-500/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                <User className="h-3 w-3" />
                {assignedAgent ? `Connected to ${assignedAgent}` : "Connecting to agent..."}
                {ticketId && <span className="opacity-70">#{ticketId.slice(-6)}</span>}
              </div>
            )}
            {/* Mode Switcher */}
            <div className="flex gap-1 mt-2">
              <Button
                variant={chatMode === "chat" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChatMode("chat")}
                className="text-xs h-6"
              >
                Chat
              </Button>
              <Button
                variant={chatMode === "categories" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChatMode("categories")}
                className="text-xs h-6"
              >
                Topics
              </Button>
              <Button
                variant={chatMode === "support-form" ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setChatMode("support-form")}
                className="text-xs h-6"
              >
                Contact
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            {/* Support Ticket Form */}
            {chatMode === "support-form" && (
              <div className="p-4">
                <SupportTicketForm onSubmit={handleSupportTicket} onCancel={() => setChatMode("chat")} />
              </div>
            )}

            {/* Categories View */}
            {chatMode === "categories" && (
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Browse Help Topics</h3>
                  {reflectSupport
                    .getCategoriesOverview()
                    .split("\n\n")
                    .map((category, index) => (
                      <div key={index} className="p-3 bg-muted rounded-lg text-sm">
                        {category.split("\n").map((line, lineIndex) => (
                          <div key={lineIndex} className={lineIndex === 0 ? "font-medium" : "text-muted-foreground"}>
                            {line}
                          </div>
                        ))}
                      </div>
                    ))}
                  <Button variant="outline" size="sm" onClick={() => setChatMode("chat")} className="w-full">
                    Back to Chat
                  </Button>
                </div>
              </ScrollArea>
            )}

            {/* Chat Interface */}
            {chatMode === "chat" && (
              <>
                {/* Offline/Queue Status Alert */}
                {(networkStatus === "offline" || queueSize > 0) && (
                  <Alert className="m-4 mb-0">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {networkStatus === "offline" ? (
                        <>
                          You're offline. Messages will be sent when connection is restored.
                          {queueSize > 0 && (
                            <>
                              <br />
                              <span className="font-medium">{queueSize} messages queued</span>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{queueStatus.pending} messages pending</span>
                          {queueStatus.failed > 0 && (
                            <>
                              , <span className="font-medium text-red-600">{queueStatus.failed} failed</span>
                            </>
                          )}
                          <Button variant="ghost" size="sm" onClick={handleClearQueue} className="ml-2 h-6 px-2">
                            <Trash2 className="h-3 w-3 mr-1" />
                            Clear
                          </Button>
                        </>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-4 max-h-64">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn("flex gap-2", message.sender === "user" ? "justify-end" : "justify-start")}
                      >
                        {message.sender === "agent" && (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-white" />
                          </div>
                        )}

                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3 text-sm",
                            message.sender === "user"
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-muted",
                          )}
                        >
                          <p className="whitespace-pre-wrap">{message.text}</p>
                          <div
                            className={cn(
                              "flex items-center justify-between mt-1",
                              message.sender === "user" ? "text-white/70" : "text-muted-foreground",
                            )}
                          >
                            <p className="text-xs opacity-70">{formatTime(message.timestamp)}</p>
                            <div className="flex items-center gap-1">
                              {getMessageStatusIcon(message)}
                              {message.status === "failed" && message.queueId && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRetryMessage(message)}
                                  className="h-4 w-4 p-0 hover:bg-white/20"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {message.sender === "user" && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Quick Actions */}
                    {showQuickActions && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Quick actions:</p>
                        <div className="grid grid-cols-1 gap-1">
                          {quickActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAction(action)}
                              className="justify-start text-xs h-8"
                            >
                              <HelpCircle className="h-3 w-3 mr-2" />
                              {action}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex gap-2 justify-start">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="bg-muted rounded-lg p-3 text-sm">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        networkStatus === "offline"
                          ? "Type message (will send when online)..."
                          : "Ask me anything about Reflect..."
                      }
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      size="icon"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {networkStatus === "offline" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      📱 Offline mode: Messages will be sent automatically when you're back online
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </>
  )
}
