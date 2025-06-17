"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface WalletCardProps {
  balance: number
}

export function WalletCard({ balance }: WalletCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center justify-between">
          My card
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
            + Add card
          </Button>
        </CardTitle>
        <p className="text-slate-400 text-sm">4 active card balance</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Credit Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div className="text-2xl font-bold">VISA</div>
            <CreditCard className="w-8 h-8 opacity-80" />
          </div>

          <div className="space-y-2">
            <div className="text-lg font-mono tracking-wider">0239 8347 9493 3424</div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <div className="text-xs opacity-80">Card holder</div>
                <div>Alan Thomson</div>
              </div>
              <div>
                <div className="text-xs opacity-80">Expiry</div>
                <div>08/28</div>
              </div>
            </div>
          </div>

          {/* Card decoration */}
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full"></div>
        </div>

        {/* Balance */}
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Balance</span>
            <div className="text-right">
              <div className="text-white font-bold text-lg">$ {balance.toLocaleString()}.00 USD</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Transfer
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700">
            <ArrowDownLeft className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
