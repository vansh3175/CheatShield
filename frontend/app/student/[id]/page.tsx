"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  FileText,
  User,
  CheckCircle,
  Flag,
  ArrowLeft,
  AlertTriangle,
  Shield,
  BarChart,
} from "lucide-react"
import { motion } from "framer-motion"
import { generateStudentDetails } from "@/lib/dummy-data"
import type { StudentDetail } from "@/types/student"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Timeline } from "@/components/timeline"
import { RiskScoreChart } from "@/components/risk-score-chart"

export default function StudentDetailPage() {
  const { id } = useParams()
  const [student, setStudent] = useState<StudentDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      if (typeof id === "string") {
        const data = generateStudentDetails(id)
        setStudent(data)
      }
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [id])

  const getRiskColor = (score: number) => {
    if (score >= 7) return "destructive"
    if (score >= 4) return "secondary"
    return "default"
  }

  const getRiskEmoji = (score: number) => {
    if (score >= 7) return "🔴"
    if (score >= 4) return "🟠"
    return "🟢"
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <DashboardHeader title="Student Details" />
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-900/50 rounded-md w-1/3"></div>
            <div className="h-64 bg-slate-900/50 rounded-md"></div>
            <div className="h-64 bg-slate-900/50 rounded-md"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-950">
        <DashboardHeader title="Student Not Found" />
        <div className="container mx-auto px-4 py-6 text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Student Not Found</h2>
          <p className="text-slate-400 mb-6">The student with ID {id} could not be found.</p>
          <Link href="/dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <DashboardHeader title="Student Details" />

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-slate-800 bg-slate-900/50 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-teal-950/50 p-3 rounded-full">
                    <User className="h-8 w-8 text-teal-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-200">{student.name}</h1>
                    <p className="text-slate-400">{student.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getRiskColor(student.currentRiskScore)} className="text-sm px-3 py-1">
                    {getRiskEmoji(student.currentRiskScore)} Risk Score: {student.currentRiskScore}/10
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-800 bg-green-950/30 text-green-400 hover:bg-green-900/50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Safe
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-800 bg-red-950/30 text-red-400 hover:bg-red-900/50"
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Flag for Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="border-slate-800 bg-slate-900/50 col-span-1">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-teal-500" />
                  Current Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-300">Last Activity</p>
                      <p className="text-slate-400">{student.lastActivity}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-slate-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-300">Last Detected Text</p>
                      <p className="text-slate-400">{student.lastDetectedText}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-900/50 col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-teal-500" />
                  Risk Score Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <RiskScoreChart data={student.riskHistory} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="mb-6 bg-slate-900 border border-slate-800">
              <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="mt-0">
              <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                  <CardTitle className="text-slate-200">Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <Timeline events={student.events} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
