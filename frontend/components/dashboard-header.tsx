import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, HelpCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"

interface DashboardHeaderProps {
  title: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center gap-2 md:hidden">
          <SidebarTrigger />
        </div>
        <h1 className="text-xl font-semibold">{title}</h1>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:flex w-40 lg:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 bg-background/50 border-border" />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              3
            </span>
            <span className="sr-only">Notifications</span>
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">Help</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
