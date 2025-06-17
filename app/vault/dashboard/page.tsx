"use client"

import { useState, useEffect } from "react"
import { VaultHeader } from "@/components/vault/vault-header"
import { VaultWalletCard } from "@/components/vault/vault-wallet-card"
import { VaultPriceChart } from "@/components/vault/vault-price-chart"
import { VaultAssetsList } from "@/components/vault/vault-assets-list"
import { VaultCryptoPrices } from "@/components/vault/vault-crypto-prices"
import { VaultExchangePanel } from "@/components/vault/vault-exchange-panel"
import { useRouter } from "next/navigation"

export default function VaultDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [liveData, setLiveData] = useState({
    balance: 254596.04,
    change: 2.75,
    cardBalance: 25596,
    lastUpdate: new Date(),
  })
  const router = useRouter()

  useEffect(() => {
    const sessionData = localStorage.getItem("vault_session")
    if (!sessionData) {
      router.push("/vault/login")
      return
    }
    setUser(JSON.parse(sessionData))
  }, [router])

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData((prev) => ({
        ...prev,
        balance: prev.balance + (Math.random() - 0.5) * 1000,
        change: prev.change + (Math.random() - 0.5) * 0.5,
        lastUpdate: new Date(),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your vault...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <VaultHeader user={user} />

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Wallet & Crypto Prices */}
          <div className="lg:col-span-3 space-y-6">
            <VaultWalletCard balance={liveData.cardBalance} />
            <VaultCryptoPrices />
          </div>

          {/* Center Column - Main Chart & Assets */}
          <div className="lg:col-span-6 space-y-6">
            <VaultPriceChart
              balance={liveData.balance}
              change={liveData.change}
              asset="Ethereum"
              symbol="ETH"
              lastUpdate={liveData.lastUpdate}
            />
            <VaultAssetsList />
          </div>

          {/* Right Column - Exchange */}
          <div className="lg:col-span-3">
            <VaultExchangePanel />
          </div>
        </div>
      </div>
    </div>
  )
}
