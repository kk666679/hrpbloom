"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  ChevronDown,
  ChevronRight,
  Info,
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
    children: [
      {
        name: "Add Employee",
        href: "/employees/add",
        roles: ["ADMIN", "HR"],
      },
      {
        name: "Employee List",
        href: "/employees",
        roles: ["ADMIN", "HR", "MANAGER"],
      },
    ],
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
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})

  const userRole = user?.role || "EMPLOYEE"
  const filteredNavigation = navigation.filter((item) => item.roles.includes(userRole))

  const handleSignOut = () => {
    logout()
  }

  const toggleSection = (sectionName: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }))
  }

  return (
    <TooltipProvider>
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
            if (item.children && item.children.length > 0) {
              const isSectionOpen = openSections[item.name] ?? false
              return (
                <div key={item.name} className="mb-2">
                  <Collapsible open={isSectionOpen} onOpenChange={() => toggleSection(item.name)}>
                    <CollapsibleTrigger
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                      {!collapsed && (
                        <span>
                          {isSectionOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                        </span>
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-8 mt-1 flex flex-col space-y-1">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.href || pathname.startsWith(child.href + "/")
                          if (!child.roles.includes(userRole)) return null
                          return (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isChildActive
                                  ? "bg-primary text-primary-foreground"
                                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                              )}
                            >
                              {!collapsed && <span>{child.name}</span>}
                            </Link>
                          )
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )
            }
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>
                  <Link
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
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>

        {/* User Section */}
        <div className="border-t p-4">
          {!collapsed && user && (
            <div className="mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {user.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.role || 'EMPLOYEE'}</p>
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
    </TooltipProvider>
  )
}
