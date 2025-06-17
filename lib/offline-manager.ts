export type NetworkStatus = "online" | "offline" | "unknown"

export class OfflineManager {
  private status: NetworkStatus = "unknown"
  private listeners: ((status: NetworkStatus) => void)[] = []

  constructor() {
    this.initializeNetworkDetection()
  }

  private initializeNetworkDetection() {
    if (typeof window === "undefined") return

    // Initial status
    this.status = navigator.onLine ? "online" : "offline"

    // Listen for network changes
    window.addEventListener("online", this.handleOnline.bind(this))
    window.addEventListener("offline", this.handleOffline.bind(this))

    // Additional checks for more reliable detection
    this.startPeriodicCheck()
  }

  private handleOnline() {
    console.log("Network: Back online")
    this.updateStatus("online")
  }

  private handleOffline() {
    console.log("Network: Gone offline")
    this.updateStatus("offline")
  }

  private updateStatus(newStatus: NetworkStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus
      this.notifyListeners()
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener(this.status)
      } catch (error) {
        console.error("Error in network status listener:", error)
      }
    })
  }

  private startPeriodicCheck() {
    // Check network status every 30 seconds
    setInterval(() => {
      this.checkNetworkStatus()
    }, 30000)
  }

  private async checkNetworkStatus() {
    try {
      // Try to fetch a small resource to verify connectivity
      const response = await fetch("/favicon.ico", {
        method: "HEAD",
        cache: "no-cache",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      const isOnline = response.ok
      this.updateStatus(isOnline ? "online" : "offline")
    } catch (error) {
      // If fetch fails, we're likely offline
      this.updateStatus("offline")
    }
  }

  getStatus(): NetworkStatus {
    return this.status
  }

  isOnline(): boolean {
    return this.status === "online"
  }

  isOffline(): boolean {
    return this.status === "offline"
  }

  onStatusChange(listener: (status: NetworkStatus) => void) {
    this.listeners.push(listener)

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Force a network check
  async checkConnection(): Promise<boolean> {
    await this.checkNetworkStatus()
    return this.isOnline()
  }
}

export const offlineManager = new OfflineManager()
