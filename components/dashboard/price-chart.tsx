"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PriceChartProps {
  balance: number
  change: number
  asset: string
  symbol: string
}

export function PriceChart({ balance, change, asset, symbol }: PriceChartProps) {
  // Mock chart data points for the candlestick chart
  const chartData = [
    { x: 0, open: 2400, high: 2500, low: 2350, close: 2450 },
    { x: 1, open: 2450, high: 2600, low: 2400, close: 2580 },
    { x: 2, open: 2580, high: 2650, low: 2520, low: 2520, close: 2600 },
    { x: 3, open: 2600, high: 2700, low: 2550, close: 2650 },
    { x: 4, open: 2650, high: 2750, low: 2600, close: 2720 },
    { x: 5, open: 2720, high: 2800, low: 2680, close: 2780 },
    { x: 6, open: 2780, high: 2850, low: 2750, close: 2820 },
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <div className="text-3xl font-bold text-white">
                $ {balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <Badge className={`${change >= 0 ? "bg-green-600" : "bg-red-600"} text-white`}>
                {change >= 0 ? "+" : ""}
                {change}%
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-slate-300">
                {asset} - {symbol}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart Container */}
        <div className="h-64 bg-slate-900/50 rounded-lg p-4 relative overflow-hidden">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-4 text-xs text-slate-400 space-y-8">
            <div>3000</div>
            <div>2500</div>
            <div>2000</div>
            <div>1500</div>
          </div>

          {/* Chart area */}
          <div className="ml-8 h-full relative">
            {/* Grid lines */}
            <div className="absolute inset-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute w-full border-t border-slate-700/50" style={{ top: `${i * 25}%` }} />
              ))}
            </div>

            {/* Candlestick bars */}
            <div className="flex items-end justify-between h-full pt-4 pb-8">
              {chartData.map((candle, index) => {
                const isGreen = candle.close > candle.open
                const bodyHeight = Math.abs(candle.close - candle.open) / 10
                const wickTop = (candle.high - Math.max(candle.open, candle.close)) / 10
                const wickBottom = (Math.min(candle.open, candle.close) - candle.low) / 10

                return (
                  <div key={index} className="flex flex-col items-center h-full justify-end">
                    {/* Upper wick */}
                    <div
                      className={`w-0.5 ${isGreen ? "bg-green-400" : "bg-red-400"}`}
                      style={{ height: `${wickTop * 2}px` }}
                    />
                    {/* Body */}
                    <div
                      className={`w-3 ${isGreen ? "bg-green-400" : "bg-red-400"}`}
                      style={{ height: `${bodyHeight * 2}px` }}
                    />
                    {/* Lower wick */}
                    <div
                      className={`w-0.5 ${isGreen ? "bg-green-400" : "bg-red-400"}`}
                      style={{ height: `${wickBottom * 2}px` }}
                    />
                  </div>
                )
              })}
            </div>

            {/* Price line overlay */}
            <div className="absolute inset-0 flex items-center">
              <svg className="w-full h-full" viewBox="0 0 300 200">
                <path
                  d="M 0 150 Q 50 120 100 100 T 200 80 T 300 60"
                  stroke="#3B82F6"
                  strokeWidth="2"
                  fill="none"
                  className="drop-shadow-sm"
                />
                <path
                  d="M 0 150 Q 50 120 100 100 T 200 80 T 300 60 L 300 200 L 0 200 Z"
                  fill="url(#gradient)"
                  className="opacity-20"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Tooltip */}
            <div className="absolute top-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-2 text-xs">
              <div className="text-slate-400">Nov 2024</div>
              <div className="text-green-400">↗ $2,847.00</div>
              <div className="text-slate-300">$2,795.00</div>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-slate-400 mt-2 ml-8">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Chart Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700">
          <div>
            <div className="text-slate-400 text-sm">Capital</div>
            <div className="text-white font-semibold">2.45 T</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm">Volume</div>
            <div className="text-white font-semibold">53.86 M</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm">24h Change</div>
            <div className="text-green-400 font-semibold">+2.75%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
