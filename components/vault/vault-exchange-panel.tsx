"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, MoreHorizontal, Activity, Clock } from "lucide-react"

export function VaultExchangePanel() {
  const [fromAmount, setFromAmount] = useState("0.000568")
  const [toAmount, setToAmount] = useState("0.00985")
  const [exchangeRate, setExchangeRate] = useState(17.25)

  const [recentTransactions, setRecentTransactions] = useState([
    {
      pair: "BTC/USDT",
      amount: "0.000568",
      status: "Received",
      time: "2 min ago",
      type: "buy",
    },
    {
      pair: "ETH/USDT",
      amount: "0.00985",
      status: "Received",
      time: "5 min ago",
      type: "sell",
    },
  ])

  // Simulate live exchange rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setExchangeRate((prev) => prev + (Math.random() - 0.5) * 0.5)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update toAmount when fromAmount or rate changes
  useEffect(() => {
    const from = Number.parseFloat(fromAmount) || 0
    setToAmount((from * exchangeRate).toFixed(6))
  }, [fromAmount, exchangeRate])

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center space-x-2">
              <span>Exchange</span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </CardTitle>
            <p className="text-slate-400 text-sm">Advanced trading tools</p>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Exchange Form */}
        <div className="space-y-4">
          {/* From */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">From</span>
              <span className="text-slate-400 text-sm">Balance: 0.00985</span>
            </div>
            <div className="flex space-x-3">
              <Select defaultValue="btc">
                <SelectTrigger className="w-20 bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="btc" className="text-white">
                    BTC
                  </SelectItem>
                  <SelectItem value="eth" className="text-white">
                    ETH
                  </SelectItem>
                  <SelectItem value="usdt" className="text-white">
                    USDT
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                className="flex-1 bg-slate-700/50 border-slate-600 text-white font-mono"
                placeholder="0.000000"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white bg-slate-700/30 hover:bg-slate-700/50 rounded-full p-2"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-medium">To</span>
              <span className="text-slate-400 text-sm">You will receive</span>
            </div>
            <div className="flex space-x-3">
              <Select defaultValue="eth">
                <SelectTrigger className="w-20 bg-slate-700/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="btc" className="text-white">
                    BTC
                  </SelectItem>
                  <SelectItem value="eth" className="text-white">
                    ETH
                  </SelectItem>
                  <SelectItem value="usdt" className="text-white">
                    USDT
                  </SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={toAmount}
                className="flex-1 bg-slate-700/50 border-slate-600 text-white font-mono"
                readOnly
              />
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/30">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Exchange Rate</span>
                <span className="text-white font-medium">1 BTC = {exchangeRate.toFixed(2)} ETH</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Network Fee</span>
                <span className="text-white">~$2.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Estimated Time</span>
                <span className="text-green-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  ~2 min
                </span>
              </div>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <Activity className="w-4 h-4 mr-2" />
            Exchange
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
            <span>Recent Activity</span>
            <Badge className="bg-blue-600/20 text-blue-400 text-xs">Live</Badge>
          </h4>
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/20 rounded-lg border border-slate-600/20"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      tx.type === "buy" ? "bg-green-600/20" : "bg-red-600/20"
                    }`}
                  >
                    <ArrowUpDown className={`w-4 h-4 ${tx.type === "buy" ? "text-green-400" : "text-red-400"}`} />
                  </div>
                  <div>
                    <div className="text-white text-sm font-medium">{tx.pair}</div>
                    <div className="text-slate-400 text-xs">{tx.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm font-medium">{tx.amount}</div>
                  <Badge className="bg-green-600/20 text-green-400 text-xs">{tx.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
              Market Orders
            </Button>
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
              Limit Orders
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
