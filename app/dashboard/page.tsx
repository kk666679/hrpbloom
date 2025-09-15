"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
            <p className="text-zinc-400">Role: {user.role}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Employee Management</CardTitle>
              <CardDescription>Manage employee records and profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90">View Employees</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Payroll</CardTitle>
              <CardDescription>Process payroll and manage salaries</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90">Manage Payroll</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Leave Management</CardTitle>
              <CardDescription>Track and approve leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90">View Leaves</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Reports</CardTitle>
              <CardDescription>Generate HR reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90">View Reports</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Settings</CardTitle>
              <CardDescription>Configure system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90">Open Settings</Button>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#e78a53] hover:bg-[#e78a53]/90">Edit Profile</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
