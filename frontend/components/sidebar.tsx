"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Settings, LogOut, Users, Shield, Bell, HelpCircle, BarChart3 } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function Sidebar() {
  const pathname = usePathname()
  const [isSidebarOpen, setSidebarOpen] = useState(true)

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  return (
    <SidebarComponent className={`transition-all ${isSidebarOpen ? "w-64" : "w-16"}`}>
      <SidebarHeader className="flex flex-col gap-0 py-4">
        <div className="flex items-center gap-2 px-4">
          <div className="bg-primary/10 p-1.5 rounded-md">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className={`font-bold text-xl tracking-tight ${!isSidebarOpen && "hidden"}`}>
            <span className="text-gradient">ExamGuard Pro</span>
          </div>
          <SidebarTrigger className="ml-auto lg:block" onClick={toggleSidebar} />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={`${!isSidebarOpen && "hidden"}`}>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span className={`${!isSidebarOpen && "hidden"}`}>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href="#">
                    <Users />
                    <span className={`${!isSidebarOpen && "hidden"}`}>Students</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href="#">
                    <BarChart3 />
                    <span className={`${!isSidebarOpen && "hidden"}`}>Analytics</span>
                    <Badge className="ml-auto bg-primary/20 text-primary text-xs">New</Badge>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false}>
                  <Link href="#">
                    <Bell />
                    <span className={`${!isSidebarOpen && "hidden"}`}>Alerts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")}>
                  <Link href="/settings">
                    <Settings />
                    <span className={`${!isSidebarOpen && "hidden"}`}>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className={`${!isSidebarOpen && "hidden"}`}>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <HelpCircle />
                    <span className={`${!isSidebarOpen && "hidden"}`}>Help & Documentation</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
              <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
            </Avatar>
            <div className={`${!isSidebarOpen && "hidden"}`}>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@examguard.io</p>
            </div>
            <ThemeToggle className="ml-auto" />
          </div>

          <Button variant="outline" size="sm" className="w-full">
            <LogOut className="h-4 w-4 mr-2" />
            <span className={`${!isSidebarOpen && "hidden"}`}>Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </SidebarComponent>
  )
}
