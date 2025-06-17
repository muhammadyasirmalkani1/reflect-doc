"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react"
import { useEffect, useState } from "react"

export function VaultCryptoPrices() {
  const [cryptos, setCryptos] = useState([
    {
      name: "Binance",
      symbol: "BNB",
      price: "536,747.96",
      change: "+1.52%",
      positive: true,
      color: "bg-yellow-500",
      rawPrice: 536747.96,
    },
    {
      name: "XRP",
      symbol: "XRP",
      price: "536,747.96",
      change: "-1.82%",
      positive: false,
      color: "bg-gray-500",
      rawPrice: 536747.96,
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "536,747.96",
      change: "+5.95%",
      positive: true,
      color: "bg-orange-500",
      rawPrice: 536747.96,
    },
  ])

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCryptos((prev) =>
        prev.map((crypto) => {
          const changePercent = (Math.random() - 0.5) * 8
          const newPrice = crypto.rawPrice * (1 + changePercent / 100)
          return {
            ...crypto,
            rawPrice: newPrice,
            price: newPrice.toLocaleString("en-US", { minimumFractionDigits: 2 }),
            change: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
            positive: changePercent >= 0,
          }
        }),
      )
    }, 3500)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Cryptocurrencies Prices</span>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cryptos.map((crypto, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg hover:bg-slate-700/40 transition-all duration-200 border border-slate-600/20"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${crypto.color} rounded-full flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-sm font-bold">{crypto.symbol.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-white font-medium flex items-center space-x-2">
                    <span>{crypto.name}</span>
                    {crypto.positive ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                  </div>
                  <div className="text-slate-400 text-sm">{crypto.symbol}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-medium">$ {crypto.price}</div>
                <Badge
                  className={`text-xs border-0 ${
                    crypto.positive ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                  }`}
                >
                  {crypto.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Market Summary */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-600/10 rounded-lg p-3 border border-green-600/20">
              <div className="text-green-400 text-sm font-medium">Market Cap</div>
              <div className="text-white text-lg font-bold">$2.1T</div>
              <div className="text-green-400 text-xs">+5.2%</div>
            </div>
            <div className="bg-blue-600/10 rounded-lg p-3 border border-blue-600/20">
              <div className="text-blue-400 text-sm font-medium">24h Volume</div>
              <div className="text-white text-lg font-bold">$89.5B</div>
              <div className="text-blue-400 text-xs">Active</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
