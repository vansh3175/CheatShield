import type * as React from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: React.ReactNode
  data: any[]
  tooltipClassName?: string
  className?: string
}

export function ChartContainer({ children, data, tooltipClassName, className }: ChartContainerProps) {
  return <div className={cn("w-full", className)}>{children}</div>
}

interface ChartProps {
  children: React.ReactNode
}

export function Chart({ children }: ChartProps) {
  return <>{children}</>
}

interface ChartTooltipContentProps {
  className?: string
  fields: {
    key: string
    label: string
    formatter?: (value: any) => string
    color: string
  }[]
}

export function ChartTooltipContent({ className, fields }: ChartTooltipContentProps) {
  return (
    <div className={cn("p-2", className)}>
      {fields.map((field) => (
        <div key={field.key} className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: field.color }}></span>
          <span>
            {field.label}: {field.formatter ? field.formatter(data?.[0]?.[field.key]) : data?.[0]?.[field.key]}
          </span>
        </div>
      ))}
    </div>
  )
}

interface ChartTooltipProps {
  content: React.ReactNode
  className?: string
}

export function ChartTooltip({ content, className }: ChartTooltipProps) {
  return <>{content}</>
}
