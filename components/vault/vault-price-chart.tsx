"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

interface VaultPriceChartProps {
  balance: number
  change: number
  asset: string
  symbol: string
  lastUpdate: Date
}

export function VaultPriceChart({ balance, change, asset, symbol, lastUpdate }: VaultPriceChartProps) {
  const [chartData, setChartData] = useState([
    { x: 0, high: 2800, low: 2400, value: 2600 },
    { x: 1, high: 2900, low: 2500, value: 2750 },
    { x: 2, high: 3000, low: 2600, value: 2850 },
    { x: 3, high: 3100, low: 2700, value: 2950 },
    { x: 4, high: 3200, low: 2800, value: 3050 },
    { x: 5, high: 3300, low: 2900, value: 3150 },
    { x: 6, high: 3400, low: 3000, value: 3250 },
  ])

  // Simulate live chart updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev]
        const lastPoint = newData[newData.length - 1]
        const variation = (Math.random() - 0.5) * 200
        newData.push({
          x: lastPoint.x + 1,
          high: lastPoint.value + Math.abs(variation) + 50,
          low: lastPoint.value - Math.abs(variation) - 50,
          value: lastPoint.value + variation,
        })
        return newData.slice(-20) // Keep last 20 points
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="text-3xl font-bold text-white">
                $ {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <Badge
                className={`${
                  change >= 0 ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                } border-0 font-medium`}
              >
                {change >= 0 ? "+" : ""}
                {change.toFixed(2)}%
              </Badge>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-slate-300 font-medium">
                  {asset} - {symbol}
                </span>
              </div>
              <div className="text-xs text-slate-400">Updated {lastUpdate.toLocaleTimeString()}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <TrendingUp className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Container */}
        <div className="h-80 bg-slate-900/50 rounded-xl p-6 relative overflow-hidden border border-slate-700/50">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-6 text-xs text-slate-400 space-y-12">
            <div>3500</div>
            <div>3000</div>
            <div>2500</div>
            <div>2000</div>
          </div>

          {/* Chart area */}
          <div className="ml-10 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-full border-t border-slate-700/30" style={{ top: `${i * 20}%` }} />
              ))}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-full border-l border-slate-700/30"
                  style={{ left: `${i * 12.5}%` }}
                />
              ))}
            </div>

            {/* Candlestick Chart */}
            <div className="flex items-end justify-between h-full pt-4 pb-12">
              {chartData.slice(-12).map((candle, index) => {
                const isGreen = Math.random() > 0.5
                const height = Math.max(20, (candle.value / 3500) * 200)

                return (
                  <div key={index} className="flex flex-col items-center h-full justify-end">
                    {/* Candlestick */}
                    <div
                      className={`w-2 ${isGreen ? "bg-green-400" : "bg-red-400"} rounded-sm shadow-sm`}
                      style={{ height: `${height}px` }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Price line overlay */}
            <div className="absolute inset-0 flex items-center pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M 0 200 Q 50 180 100 160 T 200 120 T 300 100 T 400 80"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  fill="none"
                  className="drop-shadow-lg"
                />
                <path
                  d="M 0 200 Q 50 180 100 160 T 200 120 T 300 100 T 400 80 L 400 300 L 0 300 Z"
                  fill="url(#priceGradient)"
                />
              </svg>
            </div>

            {/* Live price tooltip */}
            <div className="absolute top-6 right-6 bg-slate-800/90 border border-slate-600 rounded-lg p-3 text-sm backdrop-blur-sm">
              <div className="text-slate-400 text-xs mb-1">Nov 2024</div>
              <div className="text-green-400 font-medium">↗ $3,047.00</div>
              <div className="text-slate-300">Volume: 2.1M</div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-slate-400 mt-2 ml-10">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>

        {/* Chart Stats */}
        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t border-slate-700">
          <div className="text-center">
            <div className="text-slate-400 text-sm mb-1">Capital</div>
            <div className="text-white font-bold text-lg">2.45 T</div>
            <div className="text-green-400 text-xs">+12.5%</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 text-sm mb-1">Volume</div>
            <div className="text-white font-bold text-lg">53.86 M</div>
            <div className="text-blue-400 text-xs">24h</div>
          </div>
          <div className="text-center">
            <div className="text-slate-400 text-sm mb-1">Market Cap</div>
            <div className="text-white font-bold text-lg">1.2 T</div>
            <div className="text-purple-400 text-xs">Global</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
