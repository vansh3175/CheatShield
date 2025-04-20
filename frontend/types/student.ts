export interface Student {
  id: string
  name: string
  riskScore: number
  lastActivity: string
  lastDetectedText: string
}

export interface Event {
  timestamp: string
  type: string
  riskLevel: number
  description: string
}

export interface RiskHistoryPoint {
  time: string
  score: number
}

export interface Screenshot {
  id: string
  timestamp: string
  url: string
}

export interface StudentDetail {
  id: string
  name: string
  currentRiskScore: number
  lastActivity: string
  lastDetectedText: string
  events: Event[]
  riskHistory: RiskHistoryPoint[]
  screenshots: Screenshot[]
}
