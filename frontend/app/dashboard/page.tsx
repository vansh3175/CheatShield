"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Clock, FileText, User, BarChart, RefreshCw, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { generateDummyStudents } from "@/lib/dummy-data"
import type { Student } from "@/types/student"
import Link from "next/link"
import { DashboardHeader } from "@/components/dashboard-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [activeTab, setActiveTab] = useState("grid")

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const data = generateDummyStudents(30)
      setStudents(data)
      setFilteredStudents(data)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [refreshKey])

  useEffect(() => {
    let result = [...students]

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (student) =>
          student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          student.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply risk filter
    if (riskFilter !== "all") {
      result = result.filter((student) => {
        if (riskFilter === "high") return student.riskScore >= 7
        if (riskFilter === "medium") return student.riskScore >= 4 && student.riskScore < 7
        if (riskFilter === "low") return student.riskScore < 4
        return true
      })
    }

    setFilteredStudents(result)
  }, [searchQuery, riskFilter, students])

  const handleRefresh = () => {
    setIsLoading(true)
    setRefreshKey((prev) => prev + 1)
  }

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

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader title="Live Monitoring" />

      <div className="container mx-auto px-4 py-6">
        {/* Removed extra right-side margin or padding */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID or name..."
                className="pl-8 bg-background/50 border-border"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="w-[180px] bg-background/50 border-border">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Risk Level" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background border-border">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">High Risk 🔴</SelectItem>
                <SelectItem value="medium">Medium Risk 🟠</SelectItem>
                <SelectItem value="low">Low Risk 🟢</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="border-border" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
            <Badge variant="outline" className="bg-background/50 border-border">
              {filteredStudents.length} Students
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="grid" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-background/50 border border-border">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="grid" className="mt-0">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Card key={i} className="border-border bg-card/50 h-[200px]">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-5 w-16 ml-auto" />
                          </div>
                          <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                          </div>
                          <div className="flex justify-between mt-4">
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-8 w-24" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <Card className="border-border bg-card/50 p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Students Found</h3>
                    <p className="text-muted-foreground mb-4">No students match your current search criteria.</p>
                    <Button
                      onClick={() => {
                        setSearchQuery("")
                        setRiskFilter("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student) => (
                      <Link href={`/student/${student.id}`} key={student.id} passHref>
                        <Card className="border-border bg-card/50 hover:bg-card transition-all duration-200 cursor-pointer overflow-hidden group card-hover-effect">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className="bg-primary/10 p-1.5 rounded-full">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{student.name}</h3>
                                  <p className="text-xs text-muted-foreground">{student.id}</p>
                                </div>
                              </div>
                              <Badge variant={getRiskColor(student.riskScore)} className="ml-auto">
                                {getRiskEmoji(student.riskScore)} {student.riskScore}/10
                              </Badge>
                            </div>

                            <div className="space-y-2 mb-3">
                              <div className="flex items-start gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <p className="text-sm">{student.lastActivity}</p>
                              </div>
                              <div className="flex items-start gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <p className="text-sm truncate">{student.lastDetectedText}</p>
                              </div>
                            </div>

                            <div className="flex justify-between mt-4">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs border-border bg-background/80 hover:bg-background"
                              >
                                <BarChart className="h-3.5 w-3.5 mr-1" />
                                Timeline
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                {isLoading ? (
                  <Card className="border-border bg-card/50">
                    <CardContent className="p-4 space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                          <div className="flex-1 hidden md:block">
                            <Skeleton className="h-4 w-full" />
                          </div>
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-8 w-20" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ) : filteredStudents.length === 0 ? (
                  <Card className="border-border bg-card/50 p-8 text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Students Found</h3>
                    <p className="text-muted-foreground mb-4">No students match your current search criteria.</p>
                    <Button
                      onClick={() => {
                        setSearchQuery("")
                        setRiskFilter("all")
                      }}
                    >
                      Clear Filters
                    </Button>
                  </Card>
                ) : (
                  <Card className="border-border bg-card/50">
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {filteredStudents.map((student) => (
                          <Link href={`/student/${student.id}`} key={student.id} passHref>
                            <div className="p-4 hover:bg-card transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-1.5 rounded-full">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{student.name}</h3>
                                  <p className="text-xs text-muted-foreground">{student.id}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <span>{student.lastActivity}</span>
                                </div>
                                <div className="hidden lg:flex items-center gap-2 max-w-xs">
                                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <span className="truncate">{student.lastDetectedText}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 ml-auto">
                                <Badge variant={getRiskColor(student.riskScore)}>
                                  {getRiskEmoji(student.riskScore)} {student.riskScore}/10
                                </Badge>
                                <Button variant="outline" size="sm" className="hidden md:flex text-xs border-border">
                                  <BarChart className="h-3.5 w-3.5 mr-1" />
                                  Details
                                </Button>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  )
}
