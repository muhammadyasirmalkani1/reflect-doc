"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, CreditCard, TrendingUp, Bell, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GetStartedPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const router = useRouter()

  const steps = [
    {
      id: 0,
      title: "Verify Your Identity",
      description: "Complete KYC verification to secure your account",
      icon: Shield,
      action: "Verify Now",
      time: "2-3 minutes",
    },
    {
      id: 1,
      title: "Add Payment Method",
      description: "Link your bank account or card for easy deposits",
      icon: CreditCard,
      action: "Add Payment",
      time: "1-2 minutes",
    },
    {
      id: 2,
      title: "Make Your First Deposit",
      description: "Fund your account to start trading",
      icon: TrendingUp,
      action: "Deposit Funds",
      time: "Instant",
    },
    {
      id: 3,
      title: "Enable Notifications",
      description: "Stay updated with market alerts and account activity",
      icon: Bell,
      action: "Enable Alerts",
      time: "30 seconds",
    },
  ]

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
    if (stepId < steps.length - 1) {
      setCurrentStep(stepId + 1)
    }
  }

  const handleSkipToTrading = () => {
    router.push("/dashboard")
  }

  const progress = (completedSteps.length / steps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to Vault!</h1>
            <p className="text-xl text-slate-400 mb-6">Let's get your account set up in just a few steps</p>
            <div className="max-w-md mx-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-400">Progress</span>
                <span className="text-sm text-slate-400">
                  {completedSteps.length}/{steps.length} completed
                </span>
              </div>
              <Progress value={progress} className="h-2 bg-slate-700" />
            </div>
          </div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id)
              const isCurrent = currentStep === step.id
              const Icon = step.icon

              return (
                <Card
                  key={step.id}
                  className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm transition-all ${
                    isCurrent ? "ring-2 ring-blue-500 bg-slate-800/70" : ""
                  } ${isCompleted ? "bg-green-900/20 border-green-700" : ""}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isCompleted ? "bg-green-600" : isCurrent ? "bg-blue-600" : "bg-slate-700"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Icon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {step.time}
                            </Badge>
                            {isCompleted && <Badge className="bg-green-600 text-white text-xs">Completed</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-400 mb-4">{step.description}</CardDescription>
                    <Button
                      onClick={() => handleStepComplete(step.id)}
                      disabled={isCompleted}
                      className={`w-full ${
                        isCompleted
                          ? "bg-green-600 hover:bg-green-700"
                          : isCurrent
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-slate-600 hover:bg-slate-700"
                      } text-white`}
                    >
                      {isCompleted ? "Completed" : step.action}
                      {!isCompleted && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            {completedSteps.length === steps.length ? (
              <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-lg p-6 border border-green-500/20">
                <h3 className="text-2xl font-bold text-white mb-2">🎉 All Set!</h3>
                <p className="text-slate-300 mb-4">Your account is fully configured and ready for trading.</p>
                <Button onClick={handleSkipToTrading} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Start Trading <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-slate-400">Want to explore first? You can complete these steps later.</p>
                <Button
                  variant="outline"
                  onClick={handleSkipToTrading}
                  className="border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700"
                >
                  Skip for now and explore dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
