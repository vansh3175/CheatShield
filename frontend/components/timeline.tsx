"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Event } from "@/types/student"
import { FileText, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

interface TimelineProps {
  events: Event[]
}

export function Timeline({ events }: TimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "text_detected":
        return <FileText className="h-4 w-4" />
      case "risk_increase":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getEventColor = (riskLevel: number) => {
    if (riskLevel >= 7) return "destructive"
    if (riskLevel >= 4) return "secondary"
    return "default"
  }

  return (
    <div className="space-y-8">
      {events.map((event, index) => (
        <motion.div
          key={index}
          className="relative pl-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div
            className={cn(
              "absolute left-0 top-1 h-3 w-3 rounded-full",
              event.riskLevel >= 7 ? "bg-destructive" : event.riskLevel >= 4 ? "bg-warning" : "bg-success",
            )}
          />

          {index !== events.length - 1 && (
            <div className="absolute left-1.5 top-4 h-full w-px -translate-x-1/2 bg-border" />
          )}

          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{event.timestamp}</span>
              <Badge variant={getEventColor(event.riskLevel)} className="text-xs">
                Risk: {event.riskLevel}/10
              </Badge>
            </div>

            <div className="rounded-md border border-border bg-card/50 p-3 hover:bg-card/80 transition-colors">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "mt-0.5 rounded-full p-1.5",
                    event.riskLevel >= 7
                      ? "bg-destructive/10 text-destructive"
                      : event.riskLevel >= 4
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success",
                  )}
                >
                  {getEventIcon(event.type)}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {event.type === "text_detected"
                      ? "Text Detected"
                      : "Risk Score Increased"}
                  </p>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  {/* Removed screenshot-related UI */}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
