"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WalletCard } from "@/components/dashboard/wallet-card"
import { PriceChart } from "@/components/dashboard/price-chart"
import { AssetsList } from "@/components/dashboard/assets-list"
import { CryptoPrices } from "@/components/dashboard/crypto-prices"
import { ExchangePanel } from "@/components/dashboard/exchange-panel"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Activity } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("vault_user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  const portfolioData = {
    totalBalance: 254596.04,
    change: 2.75,
    currency: "USD",
    mainAsset: "Ethereum",
    mainAssetSymbol: "ETH",
    cardBalance: 25596,
  }

  const quickStats = [
    {
      title: "Total Portfolio",
      value: "$254,596.04",
      change: "+2.75%",
      icon: DollarSign,
      positive: true,
    },
    {
      title: "24h Change",
      value: "+$6,847.32",
      change: "+2.75%",
      icon: TrendingUp,
      positive: true,
    },
    {
      title: "Active Positions",
      value: "12",
      change: "+3 new",
      icon: Activity,
      positive: true,
    },
    {
      title: "P&L Today",
      value: "+$1,234.56",
      change: "+0.48%",
      icon: TrendingUp,
      positive: true,
    },
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardHeader user={user} />

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">{stat.title}</p>
                      <p className="text-white text-xl font-bold">{stat.value}</p>
                      <p className={`text-sm ${stat.positive ? "text-green-400" : "text-red-400"}`}>{stat.change}</p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        stat.positive ? "bg-green-600/20" : "bg-red-600/20"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${stat.positive ? "text-green-400" : "text-red-400"}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            <WalletCard balance={portfolioData.cardBalance} />
            <CryptoPrices />
          </div>

          {/* Center Column */}
          <div className="lg:col-span-6 space-y-6">
            <PriceChart
              balance={portfolioData.totalBalance}
              change={portfolioData.change}
              asset={portfolioData.mainAsset}
              symbol={portfolioData.mainAssetSymbol}
            />
            <AssetsList />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3">
            <ExchangePanel />
          </div>
        </div>
      </div>
    </div>
  )
}
