"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Shield, TrendingUp, Wallet, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VaultLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      localStorage.setItem(
        "vault_session",
        JSON.stringify({
          id: "user_123",
          name: "Alan Thomson",
          email: email,
          avatar: "/placeholder.svg?height=40&width=40",
          balance: 254596.04,
          cardBalance: 25596,
          loginTime: new Date().toISOString(),
          permissions: ["trading", "portfolio", "exchange"],
        }),
      )
      router.push("/vault/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Wallet className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome to Vault
          </h1>
          <p className="text-slate-300 text-lg">Your secure crypto trading platform</p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800/80 border-slate-700 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-white">Sign In to Your Vault</CardTitle>
            <CardDescription className="text-slate-400">Access your crypto portfolio and trading tools</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300 font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alan.thomson@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-12 text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-12 text-lg pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                  <Label htmlFor="remember" className="text-slate-300 text-sm">
                    Remember me
                  </Label>
                </div>
                <Link href="/vault/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12 text-lg font-semibold shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Sign In Securely</span>
                  </div>
                )}
              </Button>
            </form>

            <Separator className="my-8 bg-slate-600" />

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-4">
                Don't have an account?{" "}
                <Link href="/vault/register" className="text-blue-400 hover:text-blue-300 font-medium">
                  Create your Vault
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-3 gap-4 text-slate-400 text-sm">
            <div className="flex flex-col items-center space-y-2">
              <Shield className="w-6 h-6 text-blue-400" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span>Real-time Trading</span>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Wallet className="w-6 h-6 text-purple-400" />
              <span>Multi-asset Support</span>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <p className="text-slate-300 text-sm text-center mb-2">Demo Credentials:</p>
          <div className="text-xs text-slate-400 text-center space-y-1">
            <p>Email: alan.thomson@example.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
