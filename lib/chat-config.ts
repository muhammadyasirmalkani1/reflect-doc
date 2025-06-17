export interface ChatConfig {
  provider: "intercom" | "zendesk" | "custom" | "mock"
  intercom?: {
    appId: string
  }
  zendesk?: {
    key: string
    subdomain: string
  }
  custom?: {
    apiUrl: string
    websocketUrl?: string
    enableWebSocket: boolean
  }
}

export const chatConfig: ChatConfig = {
  // Change to use real AI provider
  provider: "custom", // Use custom with real AI backend

  intercom: {
    appId: process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "",
  },

  zendesk: {
    key: process.env.NEXT_PUBLIC_ZENDESK_KEY || "",
    subdomain: process.env.NEXT_PUBLIC_ZENDESK_SUBDOMAIN || "",
  },

  custom: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api/chat",
    websocketUrl: process.env.NEXT_PUBLIC_WS_URL || "",
    enableWebSocket: true, // Enable real-time chat
  },
}
