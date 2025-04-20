"use client"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { RiskHistoryPoint } from "@/types/student"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, ReferenceLine } from "recharts"

interface RiskScoreChartProps {
  data: RiskHistoryPoint[]
}

export function RiskScoreChart({ data }: RiskScoreChartProps) {
  const formatTime = (time: string) => {
    return time.split(" ")[0] // Just return the hour:minute part
  }

  return (
    <ChartContainer className="h-full" data={data} tooltipClassName="bg-card border border-border">
      <Chart>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="time"
              tickFormatter={formatTime}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              minTickGap={10}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              domain={[0, 10]}
            />
            <ReferenceLine y={7} stroke="hsl(var(--destructive)/0.5)" strokeDasharray="3 3" />
            <ReferenceLine y={4} stroke="hsl(var(--warning)/0.5)" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "hsl(var(--primary))", strokeWidth: 0 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="bg-card border border-border"
                  fields={[
                    {
                      key: "score",
                      label: "Risk Score",
                      formatter: (value) => `${value}/10`,
                      color: "hsl(var(--primary))",
                    },
                  ]}
                />
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </Chart>
    </ChartContainer>
  )
}
