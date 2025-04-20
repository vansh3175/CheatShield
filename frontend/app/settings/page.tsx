"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Save, Trash2, Volume2, Bell, Clock, FileWarning, Shield, Upload } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function SettingsPage() {
  const [autoDeleteDays, setAutoDeleteDays] = useState("30")
  const [bannedKeywords, setBannedKeywords] = useState("chegg.com\nchat.openai.com\nquizlet.com\ncoursehero.com")
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [highRiskAlerts, setHighRiskAlerts] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <DashboardHeader title="Settings" />
      <Toaster />

      <div className="container mx-auto px-4 py-6">
        <Card className="border-slate-800 bg-slate-900/50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-teal-500" />
              <CardTitle className="text-slate-200">Exam Proctoring Settings</CardTitle>
            </div>
            <CardDescription className="text-slate-400">
              Configure your proctoring system preferences and security settings
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6 bg-slate-900 border border-slate-800">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-0 space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-teal-500" />
                  General Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure general system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-delete" className="text-slate-300 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      Auto-delete logs after exam
                    </Label>
                    <Switch
                      id="auto-delete"
                      checked={autoDeleteDays !== "0"}
                      onCheckedChange={(checked) => setAutoDeleteDays(checked ? "30" : "0")}
                    />
                  </div>
                  <p className="text-sm text-slate-500">
                    Automatically delete monitoring logs after the exam period ends
                  </p>
                </div>

                {autoDeleteDays !== "0" && (
                  <div className="space-y-2">
                    <Label htmlFor="delete-days" className="text-slate-300">
                      Days to keep logs
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="delete-days"
                        type="number"
                        value={autoDeleteDays}
                        onChange={(e) => setAutoDeleteDays(e.target.value)}
                        className="w-24 bg-slate-900 border-slate-800"
                      />
                      <span className="text-slate-400">days</span>
                    </div>
                    <p className="text-sm text-slate-500">Logs older than this will be permanently deleted</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-slate-800 pt-4 flex justify-end gap-2">
                <Button variant="outline" className="border-slate-800">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0 space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-teal-500" />
                  Banned Keywords
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure keywords and URLs that will trigger alerts when detected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keywords" className="text-slate-300">
                    Enter one keyword or URL per line
                  </Label>
                  <Textarea
                    id="keywords"
                    value={bannedKeywords}
                    onChange={(e) => setBannedKeywords(e.target.value)}
                    className="min-h-[200px] bg-slate-900 border-slate-800 font-mono text-sm"
                    placeholder="Enter banned keywords or URLs..."
                  />
                  <p className="text-sm text-slate-500">
                    When these keywords are detected in a student's screen, their risk score will increase
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="outline" className="border-slate-800">
                    <Upload className="h-4 w-4 mr-2" />
                    Import List
                  </Button>
                  <Button variant="outline" className="border-slate-800">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-800 pt-4 flex justify-end gap-2">
                <Button variant="outline" className="border-slate-800">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-6">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader>
                <CardTitle className="text-slate-200 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-teal-500" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Configure alerts and notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="alerts-enabled" className="text-slate-300 flex items-center gap-2">
                      <Bell className="h-4 w-4 text-slate-500" />
                      Enable Alerts
                    </Label>
                    <Switch id="alerts-enabled" checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sounds-enabled" className="text-slate-300 flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-slate-500" />
                      Enable Alert Sounds
                    </Label>
                    <Switch
                      id="sounds-enabled"
                      checked={soundsEnabled}
                      onCheckedChange={setSoundsEnabled}
                      disabled={!alertsEnabled}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-300">Alert Triggers</h3>
                  <div className="space-y-3 pl-2 border-l-2 border-slate-800">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="high-risk" className="text-slate-300">
                        High Risk Score Alerts (7-10)
                      </Label>
                      <Switch
                        id="high-risk"
                        checked={highRiskAlerts}
                        onCheckedChange={setHighRiskAlerts}
                        disabled={!alertsEnabled}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="medium-risk" className="text-slate-300">
                        Medium Risk Score Alerts (4-6)
                      </Label>
                      <Switch id="medium-risk" checked={alertsEnabled} disabled={!alertsEnabled} />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="banned-keywords" className="text-slate-300">
                        Banned Keywords Detected
                      </Label>
                      <Switch id="banned-keywords" checked={alertsEnabled} disabled={!alertsEnabled} />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-800 pt-4 flex justify-end gap-2">
                <Button variant="outline" className="border-slate-800">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
