"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Home, TrendingUp, Wallet, Eye, Users, Bell, Settings, LogOut, User, Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface VaultHeaderProps {
  user: {
    name: string
    email: string
    avatar?: string
  }
}

export function VaultHeader({ user }: VaultHeaderProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("vault_session")
    router.push("/vault/login")
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "market", label: "Market", icon: TrendingUp },
    { id: "wallet", label: "Crypto wallet", icon: Wallet },
    { id: "watchlist", label: "Watchlist", icon: Eye },
    { id: "community", label: "Community", icon: Users },
  ]

  return (
    <header className="bg-slate-800/90 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-white rotate-45" />
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search here..."
                className="pl-10 w-64 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              )
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative text-slate-300 hover:text-white">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-blue-600 text-white text-xs flex items-center justify-center animate-pulse">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-3 text-slate-300 hover:text-white">
                  <Avatar className="w-8 h-8 ring-2 ring-blue-500/20">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <User className="w-4 h-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Settings className="w-4 h-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Wallet className="w-4 h-4 mr-2" />
                  Security Center
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
