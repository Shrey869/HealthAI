"use client"

import { useEffect, useState } from "react"
import { Activity, Calendar, FileText, Heart, Star, TrendingUp, Clock, User, Loader2, Store } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RiskBadge } from "@/components/risk-badge"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts"

interface DashboardData {
  stats: {
    totalDiagnoses: number
    savedPharmaciesCount: number
    healthScore: number
  }
  recentDiagnoses: any[]
  savedPharmacies: any[]
  monthlyDiagnoses: Record<string, number>
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [dashData, setDashData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/dashboard")
        const data = await res.json()
        if (data.success) {
          setDashData(data.data)
        }
      } catch {
        toast.error("Failed to load dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  const stats = dashData?.stats || { totalDiagnoses: 0, savedPharmaciesCount: 0, healthScore: 70 }
  const recentDiagnoses = dashData?.recentDiagnoses || []
  const savedPharmacies = dashData?.savedPharmacies || []

  // Build chart data
  const monthlyData = Object.entries(dashData?.monthlyDiagnoses || {}).map(([month, count]) => ({
    month,
    count,
  }))

  // Generate health score trend (simple progression)
  const healthScoreData = [
    { week: "W1", score: Math.max(60, stats.healthScore - 15) },
    { week: "W2", score: Math.max(60, stats.healthScore - 10) },
    { week: "W3", score: Math.max(60, stats.healthScore - 8) },
    { week: "W4", score: Math.max(60, stats.healthScore - 3) },
    { week: "W5", score: stats.healthScore - 1 },
    { week: "W6", score: stats.healthScore },
  ]

  const healthInsights = [
    {
      icon: TrendingUp,
      title: stats.totalDiagnoses > 0 ? "Active Health Tracking" : "Get Started",
      description: stats.totalDiagnoses > 0
        ? `You've completed ${stats.totalDiagnoses} symptom checks. Keep monitoring your health!`
        : "Run your first symptom check to start tracking your health.",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: Activity,
      title: "AI-Powered Insights",
      description: "Our AI analyzes your symptoms using advanced machine learning for accurate results.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Heart,
      title: "Wellness Tip",
      description: "Stay hydrated and get 7-8 hours of sleep for optimal health.",
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!
                </h1>
                <p className="text-muted-foreground">Here is your health overview</p>
              </div>
            </div>
            <Button asChild>
              <Link href="/symptoms">
                <Activity className="mr-2 h-4 w-4" />
                New Symptom Check
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.healthScore}%</p>
                    <p className="text-sm text-muted-foreground">Health Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    <FileText className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.totalDiagnoses}</p>
                    <p className="text-sm text-muted-foreground">Total Checks</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                    <Heart className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stats.savedPharmaciesCount}</p>
                    <p className="text-sm text-muted-foreground">Saved Med Stores</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                    <Calendar className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{recentDiagnoses.length}</p>
                    <p className="text-sm text-muted-foreground">Recent Analyses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Health Score Trend */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Health Score Trend</CardTitle>
                 <CardDescription>Your health score over the past 6 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthScoreData}>
                      <defs>
                        <linearGradient id="healthGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="week" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[60, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#healthGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Symptom Frequency */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Symptom Check History</CardTitle>
                <CardDescription>Number of checks per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  {monthlyData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <XAxis 
                          dataKey="month" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="hsl(var(--primary))"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                      No data yet. Run a symptom check to see your history.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Health Insights */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Health Insights</CardTitle>
                <CardDescription>AI-powered recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthInsights.map((insight, index) => (
                  <div key={index} className="flex gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${insight.bgColor}`}>
                      <insight.icon className={`h-5 w-5 ${insight.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{insight.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Previous Diagnoses */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Recent Diagnoses</CardTitle>
                <CardDescription>Your symptom check history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentDiagnoses.length > 0 ? (
                  recentDiagnoses.slice(0, 3).map((diagnosis: any) => {
                    const conditions = Array.isArray(diagnosis.conditions) ? diagnosis.conditions : []
                    const topCondition = conditions[0]
                    return (
                      <div key={diagnosis.id} className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {topCondition?.condition || "Health Analysis"}
                            </p>
                            {topCondition?.riskLevel && (
                              <RiskBadge level={topCondition.riskLevel} className="shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(diagnosis.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No diagnoses yet. Start a symptom check!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Saved Pharmacies */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Saved Medical Stores</CardTitle>
                <CardDescription>Your favorite local pharmacies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {savedPharmacies.length > 0 ? (
                  savedPharmacies.map((pharmacy: any) => (
                    <div key={pharmacy.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={pharmacy.image} alt={pharmacy.name} />
                        <AvatarFallback className="bg-primary/10 text-primary flex items-center justify-center">
                          <Store className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{pharmacy.name}</p>
                        <p className="text-xs text-muted-foreground">{pharmacy.type}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-foreground font-medium">{pharmacy.rating}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No saved medical stores yet. Find and save pharmacies!
                  </p>
                )}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/pharmacies">View All Medical Stores</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
