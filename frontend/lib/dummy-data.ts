import type { Student, StudentDetail, Event, RiskHistoryPoint, Screenshot } from "@/types/student"

// Generate a random time in the format "HH:MM:SS AM/PM"
function randomTime() {
  const hours = Math.floor(Math.random() * 12) + 1
  const minutes = Math.floor(Math.random() * 60)
  const seconds = Math.floor(Math.random() * 60)
  const ampm = Math.random() > 0.5 ? "AM" : "PM"
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${ampm}`
}

// Generate random text that might be detected during an exam
function randomDetectedText() {
  const texts = [
    "https://chat.openai.com",
    "https://chegg.com/questions/math",
    "https://quizlet.com/flashcards",
    "https://coursehero.com/file/p5qt8p/",
    "Searching for 'calculus integration formula'",
    "Searching for 'physics equations cheat sheet'",
    "Viewing PDF: 'Exam_Answers.pdf'",
    "Viewing document: 'Study_Notes.docx'",
    "Email: 'Can you help with question 3?'",
    "Message: 'What did you get for problem 5?'",
    "Calculator app",
    "Viewing course materials",
    "Exam portal active",
    "No suspicious activity detected",
    "Viewing lecture notes",
  ]
  return texts[Math.floor(Math.random() * texts.length)]
}

// Generate a random risk score between 1 and 10
function randomRiskScore() {
  return Math.floor(Math.random() * 10) + 1
}

// Generate a list of dummy students
export function generateDummyStudents(count: number): Student[] {
  const students: Student[] = []
  const firstNames = ["Alex", "Jamie", "Jordan", "Taylor", "Casey", "Riley", "Avery", "Quinn", "Morgan", "Dakota"]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const id = `${firstName.toLowerCase()}-${Math.floor(Math.random() * 1000)}`
    const riskScore = randomRiskScore()
    const lastActivity = randomTime()
    const lastDetectedText = randomDetectedText()

    students.push({
      id,
      name,
      riskScore,
      lastActivity,
      lastDetectedText,
    })
  }

  return students
}

// Generate random events for a student
function generateRandomEvents(count: number): Event[] {
  const events: Event[] = []
  const eventTypes = ["text_detected", "screenshot", "risk_increase"]

  // Generate events with timestamps in descending order (newest first)
  for (let i = 0; i < count; i++) {
    const hours = Math.floor(Math.random() * 3)
    const minutes = Math.floor(Math.random() * 60)
    const seconds = Math.floor(Math.random() * 60)
    const timestamp = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ago`

    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    const riskLevel = randomRiskScore()

    let description = ""
    if (type === "text_detected") {
      description = randomDetectedText()
    } else if (type === "screenshot") {
      description = "Screenshot captured during exam"
    } else {
      description = `Risk score increased to ${riskLevel}/10`
    }

    events.push({
      timestamp,
      type,
      riskLevel,
      description,
    })
  }

  // Sort events by recency (most recent first)
  events.sort((a, b) => {
    const aTime =
      Number.parseInt(a.timestamp.split(":")[0]) * 3600 +
      Number.parseInt(a.timestamp.split(":")[1]) * 60 +
      Number.parseInt(a.timestamp.split(":")[2])
    const bTime =
      Number.parseInt(b.timestamp.split(":")[0]) * 3600 +
      Number.parseInt(b.timestamp.split(":")[1]) * 60 +
      Number.parseInt(b.timestamp.split(":")[2])
    return aTime - bTime
  })

  return events
}

// Generate risk history data points
function generateRiskHistory(count: number): RiskHistoryPoint[] {
  const data: RiskHistoryPoint[] = []
  let currentScore = Math.floor(Math.random() * 3) + 1 // Start with a low risk score

  for (let i = 0; i < count; i++) {
    const hours = Math.floor(i / 4)
    const minutes = (i % 4) * 15
    const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} hrs`

    // Occasionally increase the risk score
    if (Math.random() > 0.7) {
      currentScore = Math.min(10, currentScore + Math.floor(Math.random() * 3) + 1)
    }

    // Occasionally decrease the risk score
    if (Math.random() > 0.8) {
      currentScore = Math.max(1, currentScore - 1)
    }

    data.push({
      time,
      score: currentScore,
    })
  }

  return data
}

// Generate screenshots
function generateScreenshots(count: number): Screenshot[] {
  const screenshots: Screenshot[] = []

  for (let i = 0; i < count; i++) {
    const hours = Math.floor(Math.random() * 3)
    const minutes = Math.floor(Math.random() * 60)
    const seconds = Math.floor(Math.random() * 60)
    const timestamp = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ago`

    screenshots.push({
      id: `screenshot-${i}`,
      timestamp,
      url: `/placeholder.svg?height=150&width=300&text=Screenshot+${i}`,
    })
  }

  // Sort screenshots by recency (most recent first)
  screenshots.sort((a, b) => {
    const aTime =
      Number.parseInt(a.timestamp.split(":")[0]) * 3600 +
      Number.parseInt(a.timestamp.split(":")[1]) * 60 +
      Number.parseInt(a.timestamp.split(":")[2])
    const bTime =
      Number.parseInt(b.timestamp.split(":")[0]) * 3600 +
      Number.parseInt(b.timestamp.split(":")[1]) * 60 +
      Number.parseInt(b.timestamp.split(":")[2])
    return aTime - bTime
  })

  return screenshots
}

// Generate detailed student data
export function generateStudentDetails(id: string): StudentDetail {
  const firstNames = ["Alex", "Jamie", "Jordan", "Taylor", "Casey", "Riley", "Avery", "Quinn", "Morgan", "Dakota"]
  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Brown",
    "Jones",
    "Garcia",
    "Miller",
    "Davis",
    "Rodriguez",
    "Martinez",
  ]

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const name = `${firstName} ${lastName}`
  const currentRiskScore = randomRiskScore()
  const lastActivity = randomTime()
  const lastDetectedText = randomDetectedText()

  return {
    id,
    name,
    currentRiskScore,
    lastActivity,
    lastDetectedText,
    events: generateRandomEvents(15),
    riskHistory: generateRiskHistory(20),
    screenshots: generateScreenshots(9),
  }
}
