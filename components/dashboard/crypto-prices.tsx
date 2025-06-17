"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export function CryptoPrices() {
  const cryptos = [
    {
      name: "Binance",
      symbol: "BNB",
      price: "536,747.96",
      change: "+1.52%",
      positive: true,
      color: "bg-yellow-500",
    },
    {
      name: "XRP",
      symbol: "XRP",
      price: "536,747.96",
      change: "-1.82%",
      positive: false,
      color: "bg-gray-500",
    },
    {
      name: "Bitcoin",
      symbol: "BTC",
      price: "536,747.96",
      change: "+5.95%",
      positive: true,
      color: "bg-orange-500",
    },
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Cryptocurrencies Prices</CardTitle>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cryptos.map((crypto, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${crypto.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{crypto.symbol.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-white font-medium">{crypto.name}</div>
                  <div className="text-slate-400 text-sm">{crypto.symbol}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-white font-medium">$ {crypto.price}</div>
                <Badge
                  className={`text-xs ${
                    crypto.positive ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
                  }`}
                >
                  {crypto.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
