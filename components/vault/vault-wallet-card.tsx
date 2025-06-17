"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Volume2 } from "lucide-react"

interface VaultWalletCardProps {
  balance: number
}

export function VaultWalletCard({ balance }: VaultWalletCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-lg flex items-center justify-between">
          My card
          <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 text-sm">
            <span className="mr-1">+</span> Add card
          </Button>
        </CardTitle>
        <p className="text-slate-400 text-sm">4 active card balance</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Credit Card */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div className="text-2xl font-bold tracking-wider">VISA</div>
            <div className="flex items-center space-x-2">
              <Volume2 className="w-5 h-5 opacity-80" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-lg font-mono tracking-[0.2em] text-white/90">0239 8347 9493 3424</div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <div className="text-xs opacity-70 mb-1">Card holder</div>
                <div className="font-medium">Alan Thomson</div>
              </div>
              <div className="text-right">
                <div className="text-xs opacity-70 mb-1">Expiry</div>
                <div className="font-medium">08/28</div>
              </div>
            </div>
          </div>

          {/* Card decorations */}
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-4 right-4 w-12 h-8 bg-white/20 rounded backdrop-blur-sm"></div>
        </div>

        {/* Balance Display */}
        <div className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-400 text-sm">Balance</span>
            </div>
            <div className="text-right">
              <div className="text-white font-bold text-xl">$ {balance.toLocaleString()}.00 USD</div>
              <div className="text-slate-400 text-xs">Live balance</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Transfer
          </Button>
          <Button
            variant="outline"
            className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 font-medium py-3 rounded-xl transition-all duration-200"
          >
            <ArrowDownLeft className="w-4 h-4 mr-2" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
