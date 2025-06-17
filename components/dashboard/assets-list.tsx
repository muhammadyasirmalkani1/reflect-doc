"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, MoreHorizontal } from "lucide-react"

export function AssetsList() {
  const assets = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      amount: "0.00004",
      value: "165.563",
      change: "+3.35%",
      positive: true,
      color: "bg-orange-500",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      amount: "0.00004",
      value: "165.563",
      change: "+3.35%",
      positive: true,
      color: "bg-blue-500",
    },
    {
      name: "Tether",
      symbol: "USDT",
      amount: "0.00004",
      value: "165.563",
      change: "+3.35%",
      positive: true,
      color: "bg-green-500",
    },
    {
      name: "Binance",
      symbol: "BNB",
      amount: "0.00004",
      value: "165.563",
      change: "+3.35%",
      positive: true,
      color: "bg-yellow-500",
    },
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Your assets</CardTitle>
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
              className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${asset.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{asset.symbol.charAt(0)}</span>
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
                    className={`text-xs ${
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

        {/* Chart visualization */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-sm">Portfolio Distribution</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { month: "Jan", value: 40, color: "bg-blue-500" },
              { month: "Feb", value: 60, color: "bg-blue-600" },
              { month: "Mar", value: 80, color: "bg-blue-700" },
            ].map((bar, index) => (
              <div key={index} className="text-center">
                <div className="h-16 flex items-end justify-center mb-2">
                  <div className={`w-8 ${bar.color} rounded-t`} style={{ height: `${bar.value}%` }} />
                </div>
                <div className="text-slate-400 text-xs">{bar.month}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
