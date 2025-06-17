"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

export function ExchangePanel() {
  const [fromAmount, setFromAmount] = useState("0.000568")
  const [toAmount, setToAmount] = useState("0.00985")

  const recentTransactions = [
    {
      pair: "BTC/USDT",
      amount: "0.000568",
      status: "Received",
      time: "2 min ago",
    },
    {
      pair: "ETH/USDT",
      amount: "0.00985",
      status: "Received",
      time: "5 min ago",
    },
  ]

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Exchange</CardTitle>
            <p className="text-slate-400 text-sm">Advanced trading tools</p>
          </div>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exchange Form */}
        <div className="space-y-4">
          {/* From */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">From</span>
              <span className="text-slate-400 text-sm">Balance: 0.00985</span>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="btc">
                <SelectTrigger className="w-24 bg-slate-700/50 border-slate-600 text-white">
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
                className="flex-1 bg-slate-700/50 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          {/* To */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">To</span>
              <span className="text-slate-400 text-sm">You will receive</span>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="eth">
                <SelectTrigger className="w-24 bg-slate-700/50 border-slate-600 text-white">
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
                onChange={(e) => setToAmount(e.target.value)}
                className="flex-1 bg-slate-700/50 border-slate-600 text-white"
                readOnly
              />
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="bg-slate-700/30 rounded-lg p-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Exchange Rate</span>
              <span className="text-white">1 BTC = 17.25 ETH</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-400">Network Fee</span>
              <span className="text-white">~$2.50</span>
            </div>
          </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Exchange</Button>
        </div>

        {/* Recent Transactions */}
        <div className="pt-4 border-t border-slate-700">
          <h4 className="text-white font-medium mb-3">Recent Activity</h4>
          <div className="space-y-3">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-medium">{tx.pair}</div>
                  <div className="text-slate-400 text-xs">{tx.time}</div>
                </div>
                <div className="text-right">
                  <div className="text-white text-sm">{tx.amount}</div>
                  <Badge className="bg-green-600/20 text-green-400 text-xs">{tx.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
