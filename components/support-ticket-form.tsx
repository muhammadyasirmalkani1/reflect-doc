"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supportCategories } from "@/lib/reflect-support"
import { Mail, Phone, MessageSquare, Video } from "lucide-react"

interface SupportTicketFormProps {
  onSubmit: (ticket: {
    email: string
    subject: string
    description: string
    category: string
    priority: "low" | "medium" | "high" | "urgent"
  }) => void
  onCancel: () => void
}

export function SupportTicketForm({ onSubmit, onCancel }: SupportTicketFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    description: "",
    category: "",
    priority: "medium" as const,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.email && formData.subject && formData.description && formData.category) {
      onSubmit(formData)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Contact Support
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Options */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Live Chat
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Screen Share
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {supportCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div>
            <Textarea
              placeholder="Describe your issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">
                  <Badge variant="secondary">Low Priority</Badge>
                </SelectItem>
                <SelectItem value="medium">
                  <Badge variant="outline">Medium Priority</Badge>
                </SelectItem>
                <SelectItem value="high">
                  <Badge variant="destructive">High Priority</Badge>
                </SelectItem>
                <SelectItem value="urgent">
                  <Badge className="bg-red-600">Urgent</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Submit Ticket
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>📧 Email: support@reflect.app</p>
          <p>📞 Phone: 1-800-REFLECT (Pro users)</p>
          <p>⏰ Business Hours: Mon-Fri 9 AM - 6 PM PST</p>
        </div>
      </CardContent>
    </Card>
  )
}
