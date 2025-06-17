"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  X,
  Send,
  Bot,
  User,
  MessageCircle,
  Search,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Star,
  CheckCircle,
  Headphones,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { liveChatService, type LiveChatMessage, type ChatSession } from "@/lib/live-chat-service"
import { reflectKnowledge } from "@/lib/reflect-knowledge-base"

type ChatMode = "chat" | "browse" | "search"

export function LiveChatSupport() {
  const [isOpen, setIsOpen] = useState(false)
  const [chatMode, setChatMode] = useState<ChatMode>("chat")
  const [session, setSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<LiveChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [browseTopics, setBrowseTopics] = useState<{ [key: string]: string[] }>({})
  const [popularQuestions, setPopularQuestions] = useState<string[]>([])
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !session) {
      initializeChat()
    }
  }, [isOpen])

  const initializeChat = async () => {
    try {
      const newSession = await liveChatService.createSession()
      setSession(newSession)
      setMessages(newSession.messages)

      // Load browse topics and popular questions
      const topics = await liveChatService.getBrowseTopics()
      const questions = await liveChatService.getPopularQuestions()
      setBrowseTopics(topics)
      setPopularQuestions(questions)
    } catch (error) {
      console.error("Failed to initialize chat:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return

    setInputValue("")
    setIsTyping(true)

    try {
      const result = await liveChatService.sendMessage(session.id, inputValue)

      // Update messages with user message and responses
      setMessages((prev) => [...prev, result.userMessage, ...result.responses])

      // Handle typing indicator
      setTimeout(() => setIsTyping(false), 1000)
    } catch (error) {
      console.error("Failed to send message:", error)
      setIsTyping(false)
    }
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    inputRef.current?.focus()
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    const results = reflectKnowledge.searchKnowledge(searchQuery)
    setSearchResults(results)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (chatMode === "search") {
        handleSearch()
      } else {
        handleSendMessage()
      }
    }
  }

  const toggleTopic = (topic: string) => {
    const newExpanded = new Set(expandedTopics)
    if (newExpanded.has(topic)) {
      newExpanded.delete(topic)
    } else {
      newExpanded.add(topic)
    }
    setExpandedTopics(newExpanded)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const renderMessage = (message: LiveChatMessage) => {
    if (message.type === "typing") {
      return (
        <div key={message.id} className="flex gap-2 justify-start">
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
      )
    }

    return (
      <div key={message.id} className={cn("flex gap-2", message.sender === "user" ? "justify-end" : "justify-start")}>
        {message.sender !== "user" && (
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              message.sender === "system"
                ? "bg-gradient-to-r from-green-600 to-blue-600"
                : "bg-gradient-to-r from-purple-600 to-pink-600",
            )}
          >
            {message.sender === "system" ? (
              <Headphones className="h-4 w-4 text-white" />
            ) : (
              <Bot className="h-4 w-4 text-white" />
            )}
          </div>
        )}

        <div
          className={cn(
            "max-w-[80%] rounded-lg p-3 text-sm",
            message.sender === "user"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              : message.type === "escalation"
                ? "bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 dark:from-green-900/20 dark:to-blue-900/20 dark:border-green-800"
                : "bg-muted",
          )}
        >
          <div className="whitespace-pre-wrap">{message.text}</div>

          {/* Suggested Actions */}
          {message.metadata?.suggestedActions && message.metadata.suggestedActions.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-xs opacity-70 font-medium">Quick actions:</p>
              <div className="flex flex-wrap gap-1">
                {message.metadata.suggestedActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAction(action)}
                    className="text-xs h-6 px-2"
                  >
                    {action}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex items-center justify-between mt-2 text-xs",
              message.sender === "user" ? "text-white/70" : "text-muted-foreground",
            )}
          >
            <span>{formatTime(message.timestamp)}</span>
            {message.metadata?.confidence && (
              <Badge variant="secondary" className="text-xs">
                {Math.round(message.metadata.confidence * 100)}% confident
              </Badge>
            )}
          </div>
        </div>

        {message.sender === "user" && (
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
            "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
            "border-0 text-white hover:scale-110",
            isOpen && "rotate-180",
          )}
          size="icon"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-24 right-6 z-40 w-96 h-[600px] shadow-2xl transition-all duration-300",
            "border-purple-200 dark:border-purple-800",
            "animate-in slide-in-from-bottom-4 fade-in-0",
          )}
        >
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5" />
              Reflect Support
              <Badge
                variant="secondary"
                className="ml-auto bg-green-500/20 text-green-700 dark:text-green-300 border-0"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse" />
                Live
              </Badge>
            </CardTitle>

            {/* Mode Tabs */}
            <Tabs value={chatMode} onValueChange={(value) => setChatMode(value as ChatMode)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10">
                <TabsTrigger value="chat" className="text-xs">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="browse" className="text-xs">
                  Browse
                </TabsTrigger>
                <TabsTrigger value="search" className="text-xs">
                  Search
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0 flex flex-col h-full">
            <Tabs value={chatMode} className="flex-1 flex flex-col">
              {/* Chat Tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col m-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map(renderMessage)}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about Reflect..."
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
                </div>
              </TabsContent>

              {/* Browse Tab */}
              <TabsContent value="browse" className="flex-1 m-0">
                <ScrollArea className="h-full p-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4 text-purple-600" />
                        Popular Questions
                      </h3>
                      <div className="space-y-2">
                        {popularQuestions.slice(0, 5).map((question, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setChatMode("chat")
                              handleQuickAction(question)
                            }}
                            className="w-full justify-start text-left h-auto p-3 text-xs"
                          >
                            <HelpCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="truncate">{question}</span>
                            <ArrowRight className="h-3 w-3 ml-auto flex-shrink-0" />
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-purple-600" />
                        Browse Topics
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(browseTopics).map(([topic, subtopics]) => (
                          <Collapsible
                            key={topic}
                            open={expandedTopics.has(topic)}
                            onOpenChange={() => toggleTopic(topic)}
                          >
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" className="w-full justify-start p-3 h-auto">
                                {expandedTopics.has(topic) ? (
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 mr-2" />
                                )}
                                <span className="font-medium">{topic}</span>
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {subtopics.length}
                                </Badge>
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="ml-6 space-y-1">
                              {subtopics.map((subtopic, index) => (
                                <Button
                                  key={index}
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setChatMode("chat")
                                    handleQuickAction(subtopic)
                                  }}
                                  className="w-full justify-start text-xs h-8 px-2"
                                >
                                  <ArrowRight className="h-3 w-3 mr-2" />
                                  {subtopic}
                                </Button>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Search Tab */}
              <TabsContent value="search" className="flex-1 flex flex-col m-0">
                <div className="p-4 border-b">
                  <div className="flex gap-2">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Search help articles..."
                      className="flex-1"
                    />
                    <Button onClick={handleSearch} size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  {searchResults ? (
                    <div className="space-y-4">
                      {searchResults.quickAnswers.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-green-600" />
                            Quick Answers
                          </h3>
                          <div className="space-y-2">
                            {searchResults.quickAnswers.map((qa: any) => (
                              <Card key={qa.id} className="p-3">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{qa.question}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{qa.answer}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {Math.round(qa.confidence * 100)}% match
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setChatMode("chat")
                                          handleQuickAction(qa.question)
                                        }}
                                        className="text-xs h-6"
                                      >
                                        Ask this
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.articles.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            Help Articles
                          </h3>
                          <div className="space-y-2">
                            {searchResults.articles.map((article: any) => (
                              <Card key={article.id} className="p-3">
                                <div className="flex items-start gap-2">
                                  <BookOpen className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">{article.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                      {article.content.substring(0, 150)}...
                                    </p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <div className="flex items-center gap-1">
                                        <Star className="h-3 w-3 text-yellow-500" />
                                        <span className="text-xs">{article.helpfulness}</span>
                                      </div>
                                      <Badge variant="secondary" className="text-xs">
                                        {article.category}
                                      </Badge>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setChatMode("chat")
                                          handleQuickAction(`Tell me about: ${article.title}`)
                                        }}
                                        className="text-xs h-6"
                                      >
                                        Learn more
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.quickAnswers.length === 0 && searchResults.articles.length === 0 && (
                        <div className="text-center py-8">
                          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <p className="text-sm text-muted-foreground">No results found for "{searchQuery}"</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setChatMode("chat")
                              handleQuickAction(searchQuery)
                            }}
                            className="mt-2"
                          >
                            Ask our AI assistant
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">Search our help articles and guides</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Try searching for "backlinks", "sync", or "AI assistant"
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </>
  )
}
