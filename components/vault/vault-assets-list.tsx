"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, MoreHorizontal, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export function VaultAssetsList() {
  const [assets, setAssets] = useState([
    {
      name: "Bitcoin",
      symbol: "BTC",
      amount: "0.00004",
      value: "165.563",
      change: "+3.35%",
      positive: true,
      color: "bg-orange-500",
      price: 43250,
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      amount: "0.00004",
      value: "165.563",
      change: "+3.35%",
      positive: true,
      color: "bg-blue-500",
      price: 2850,
    },
    {
      name: "Tether",
      symbol: "USDT",
      amount: "0.00004",
      value: "165.563",
      change: "+0.01%",
      positive: true,
      color: "bg-green-500",
      price: 1.0,
    },
    {
      name: "Binance",
      symbol: "BNB",
      amount: "0.00004",
      value: "165.563",
      change: "+5.95%",
      positive: true,
      color: "bg-yellow-500",
      price: 320,
    },
  ])

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAssets((prev) =>
        prev.map((asset) => {
          const changePercent = (Math.random() - 0.5) * 10
          const newPrice = asset.price * (1 + changePercent / 100)
          return {
            ...asset,
            price: newPrice,
            change: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
            positive: changePercent >= 0,
            value: (Number.parseFloat(asset.amount) * newPrice).toFixed(3),
          }
        }),
      )
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>Your assets</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </CardTitle>
            <p className="text-slate-400 text-sm">Live tracking your assets</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-all duration-200 border border-slate-600/30"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 ${asset.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-sm font-bold">{asset.symbol.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-white font-medium">{asset.name}</div>
                  <div className="text-slate-400 text-sm">{asset.symbol}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-medium">
                  {asset.amount} {asset.symbol}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-sm">$ {asset.value}</span>
                  <Badge
                    className={`text-xs border-0 ${
                      asset.positive ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {asset.change}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Performance Chart */}
        <div className="mt-8 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 text-sm">Portfolio Performance</span>
            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
              <TrendingUp className="w-4 h-4 mr-1" />
              View Details
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[
              { month: "Jan", value: 65, color: "bg-blue-500", amount: "$45.2K" },
              { month: "Feb", value: 85, color: "bg-blue-600", amount: "$52.8K" },
              { month: "Mar", value: 75, color: "bg-blue-700", amount: "$48.9K" },
            ].map((bar, index) => (
              <div key={index} className="text-center">
                <div className="h-20 flex items-end justify-center mb-3">
                  <div
                    className={`w-8 ${bar.color} rounded-t-lg shadow-lg transition-all duration-500 hover:scale-105`}
                    style={{ height: `${bar.value}%` }}
                  />
                </div>
                <div className="text-slate-400 text-xs mb-1">{bar.month}</div>
                <div className="text-white text-sm font-medium">{bar.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
