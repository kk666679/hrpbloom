"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface Leave {
  id: number
  type: string
  startDate: string
  endDate: string
  reason: string
  status: string
  appliedAt: string
  approvedAt: string | null
  employee: {
    employeeId: string
    firstName: string
    lastName: string
    department: string
    position: string
  }
}

interface LeaveBalance {
  employee: {
    id: number
    employeeId: string
    name: string
    dateJoined: string
  }
  balance: {
    annual: number
    used: Record<string, number>
    pending: Record<string, number>
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function LeavesPage() {
  const { data: session } = useSession()
  const [leaves, setLeaves] = useState<Leave[]>([])
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const canApproveLeaves = ["ADMIN", "HR", "MANAGER"].includes(session?.user.role || "")

  useEffect(() => {
    fetchLeaves()
    fetchLeaveBalance()
  }, [currentPage, statusFilter, typeFilter])

  const fetchLeaves = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(typeFilter !== "all" && { type: typeFilter }),
      })

      const response = await fetch(`/api/leaves?${params}`)
      const data = await response.json()

      if (response.ok) {
        setLeaves(data.leaves)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching leaves:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaveBalance = async () => {
    try {
      const response = await fetch("/api/leaves/balance")
      const data = await response.json()

      if (response.ok) {
        setLeaveBalance(data)
      }
    } catch (error) {
      console.error("Error fetching leave balance:", error)
    }
  }

  const handleApproval = async (leaveId: number, status: string) => {
    try {
      const response = await fetch(`/api/leaves/${leaveId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchLeaves()
        fetchLeaveBalance()
      }
    } catch (error) {
      console.error("Error updating leave:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive"; icon: any }> = {
      PENDING: { variant: "secondary", icon: Clock },
      APPROVED: { variant: "default", icon: CheckCircle },
      REJECTED: { variant: "destructive", icon: XCircle },
      CANCELLED: { variant: "destructive", icon: AlertCircle },
    }

    const config = variants[status] || { variant: "secondary", icon: Clock }
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    )
  }

  const getLeaveTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      ANNUAL: "bg-blue-100 text-blue-800",
      SICK: "bg-red-100 text-red-800",
      MATERNITY: "bg-pink-100 text-pink-800",
      PATERNITY: "bg-green-100 text-green-800",
      UNPAID: "bg-gray-100 text-gray-800",
      EMERGENCY: "bg-orange-100 text-orange-800",
      COMPASSIONATE: "bg-purple-100 text-purple-800",
    }

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || colors.ANNUAL}`}>{type}</span>
  }

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading leave data...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Manage leave applications and track balances</p>
        </div>
        <Button asChild>
          <Link href="/leaves/apply">
            <Plus className="mr-2 h-4 w-4" />
            Apply for Leave
          </Link>
        </Button>
      </div>

      {leaveBalance && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Annual Leave Balance</p>
                  <p className="text-2xl font-bold">{leaveBalance.balance.annual} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Used This Year</p>
                  <p className="text-2xl font-bold">{leaveBalance.balance.used.ANNUAL || 0} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                  <p className="text-2xl font-bold">
                    {Object.values(leaveBalance.balance.pending).reduce((sum, count) => sum + count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Sick Leave Used</p>
                  <p className="text-2xl font-bold">{leaveBalance.balance.used.SICK || 0} days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ANNUAL">Annual Leave</SelectItem>
                <SelectItem value="SICK">Sick Leave</SelectItem>
                <SelectItem value="MATERNITY">Maternity Leave</SelectItem>
                <SelectItem value="PATERNITY">Paternity Leave</SelectItem>
                <SelectItem value="UNPAID">Unpaid Leave</SelectItem>
                <SelectItem value="EMERGENCY">Emergency Leave</SelectItem>
                <SelectItem value="COMPASSIONATE">Compassionate Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {leave.employee.firstName} {leave.employee.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {leave.employee.employeeId} • {leave.employee.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getLeaveTypeBadge(leave.type)}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(leave.startDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(leave.endDate).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{calculateLeaveDays(leave.startDate, leave.endDate)} days</TableCell>
                  <TableCell className="max-w-xs truncate">{leave.reason}</TableCell>
                  <TableCell>{getStatusBadge(leave.status)}</TableCell>
                  <TableCell>{new Date(leave.appliedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/leaves/${leave.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {canApproveLeaves && leave.status === "PENDING" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproval(leave.id, "APPROVED")}
                            className="text-green-600 hover:text-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleApproval(leave.id, "REJECTED")}
                            className="text-red-600 hover:text-red-700"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
            {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} leave applications
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
