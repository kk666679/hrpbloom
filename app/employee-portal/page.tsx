"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

interface EmployeeData {
  id: number
  firstName: string
  lastName: string
  employeeId: string
  department: string
  position: string
  leaveBalance: number
  recentLeaves: any[]
  recentDocuments: any[]
}

export default function EmployeePortal() {
  const { data: session } = useSession()
  const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await fetch("/api/employee/profile")
        const data = await response.json()
        setEmployeeData(data)
      } catch (error) {
        console.error("Error fetching employee data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchEmployeeData()
    }
  }, [session])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Portal</h1>
          <p className="text-gray-600">Welcome back, {session?.user?.name}</p>
        </div>

        {employeeData && (
          <>
            {/* Profile Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>
                      <strong>Employee ID:</strong> {employeeData.employeeId}
                    </p>
                    <p>
                      <strong>Department:</strong> {employeeData.department}
                    </p>
                    <p>
                      <strong>Position:</strong> {employeeData.position}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Leave Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{employeeData.leaveBalance}</div>
                    <p className="text-gray-600">Days remaining</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" size="sm">
                    Apply for Leave
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    View Payslips
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" size="sm">
                    Update Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Leave Applications</CardTitle>
                  <CardDescription>Your latest leave requests</CardDescription>
                </CardHeader>
                <CardContent>
                  {employeeData.recentLeaves.length > 0 ? (
                    <div className="space-y-3">
                      {employeeData.recentLeaves.map((leave: any) => (
                        <div key={leave.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{leave.type}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(leave.startDate).toLocaleDateString()} -{" "}
                              {new Date(leave.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            variant={
                              leave.status === "APPROVED"
                                ? "default"
                                : leave.status === "PENDING"
                                  ? "secondary"
                                  : "destructive"
                            }
                          >
                            {leave.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No recent leave applications</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Your uploaded documents</CardDescription>
                </CardHeader>
                <CardContent>
                  {employeeData.recentDocuments.length > 0 ? (
                    <div className="space-y-3">
                      {employeeData.recentDocuments.map((doc: any) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-gray-600">{doc.type}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No documents uploaded</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
