"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Building,
  Users,
  Calendar,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from "lucide-react"

interface SidebarProps {
  className?: string
}

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    name: "Employees",
    href: "/employees",
    icon: Users,
    roles: ["ADMIN", "HR", "MANAGER"],
    badge: "manage",
  },
  {
    name: "Leave Management",
    href: "/leaves",
    icon: Calendar,
    roles: ["ADMIN", "HR", "MANAGER", "EMPLOYEE"],
  },
  {
    name: "Payroll",
    href: "/payroll",
    icon: DollarSign,
    roles: ["ADMIN", "HR"],
    badge: "admin",
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
    roles: ["ADMIN", "HR", "EMPLOYEE"],
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    roles: ["ADMIN", "HR"],
    badge: "admin",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN"],
    badge: "admin",
  },
]

export function Sidebar({ className }: SidebarProps) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const userRole = (session?.user as any)?.role || "EMPLOYEE"
  const filteredNavigation = navigation.filter((item) => item.roles.includes(userRole))

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  return (
    <div className={cn("flex h-screen bg-background", className)}>
      {/* Sidebar */}
      <div
        className={cn("flex flex-col border-r bg-background transition-all duration-300", collapsed ? "w-16" : "w-64")}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Building className="h-6 w-6 text-primary" />
              <span className="font-semibold">HRMS Malaysia</span>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)} className="h-8 w-8 p-0">
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {filteredNavigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t p-4">
          {!collapsed && session?.user && (
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {session.user.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{(session.user as any)?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{(session.user as any)?.role || 'EMPLOYEE'}</p>
                </div>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className={cn("w-full justify-start", collapsed && "px-2")}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span className="ml-3">Sign Out</span>}
          </Button>
        </div>
      </div>
    </div>
  )
}
