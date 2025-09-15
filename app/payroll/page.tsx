"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Eye, DollarSign, Users, Calendar, TrendingUp } from "lucide-react"

interface Payroll {
  id: number
  month: number
  year: number
  basicSalary: number
  allowances: number
  deductions: number
  epfAmount: number
  socsoAmount: number
  taxAmount: number
  netSalary: number
  paidAt: string | null
  employee: {
    employeeId: string
    firstName: string
    lastName: string
    department: string
    position: string
  }
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function PayrollPage() {
  const { data: session } = useSession()
  const [payrolls, setPayrolls] = useState<Payroll[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMonth, setSelectedMonth] = useState("0")
  const [selectedYear, setSelectedYear] = useState("0")
  const [stats, setStats] = useState({
    totalPayroll: 0,
    totalEmployees: 0,
    avgSalary: 0,
    pendingPayments: 0,
  })

  const canManagePayroll = session?.user.role === "ADMIN" || session?.user.role === "HR"

  useEffect(() => {
    fetchPayrolls()
    fetchStats()
  }, [currentPage, selectedMonth, selectedYear])

  const fetchPayrolls = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(selectedMonth !== "0" && { month: selectedMonth }),
        ...(selectedYear !== "0" && { year: selectedYear }),
      })

      const response = await fetch(`/api/payroll?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPayrolls(data.payrolls)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching payrolls:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    if (!canManagePayroll) return

    try {
      const currentDate = new Date()
      const currentMonth = currentDate.getMonth() + 1
      const currentYear = currentDate.getFullYear()

      const params = new URLSearchParams({
        month: selectedMonth !== "0" ? selectedMonth : currentMonth.toString(),
        year: selectedYear !== "0" ? selectedYear : currentYear.toString(),
      })

      const response = await fetch(`/api/payroll/stats?${params}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const markAsPaid = async (payrollId: number) => {
    try {
      const response = await fetch(`/api/payroll/${payrollId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paidAt: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        fetchPayrolls()
        fetchStats()
      }
    } catch (error) {
      console.error("Error marking payroll as paid:", error)
    }
  }

  const getMonthName = (month: number) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]
    return months[month - 1]
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const months = Array.from({ length: 12 }, (_, i) => i + 1)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading payroll data...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee payroll with Malaysian compliance</p>
        </div>
        {canManagePayroll && (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/payroll/bulk">
                <Users className="mr-2 h-4 w-4" />
                Bulk Process
              </Link>
            </Button>
            <Button asChild>
              <Link href="/payroll/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Payroll
              </Link>
            </Button>
          </div>
        )}
      </div>

      {canManagePayroll && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Payroll</p>
                  <p className="text-2xl font-bold">RM {stats.totalPayroll.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Employees</p>
                  <p className="text-2xl font-bold">{stats.totalEmployees}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Avg Salary</p>
                  <p className="text-2xl font-bold">RM {stats.avgSalary.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pendingPayments}</p>
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
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Months</SelectItem>
                {months.map((month) => (
                  <SelectItem key={month} value={month.toString()}>
                    {getMonthName(month)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
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
                <TableHead>Period</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>EPF</TableHead>
                <TableHead>SOCSO</TableHead>
                <TableHead>Tax</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrolls.map((payroll) => (
                <TableRow key={payroll.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {payroll.employee.firstName} {payroll.employee.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payroll.employee.employeeId} • {payroll.employee.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getMonthName(payroll.month)} {payroll.year}
                  </TableCell>
                  <TableCell>RM {payroll.basicSalary.toLocaleString()}</TableCell>
                  <TableCell>RM {payroll.allowances.toLocaleString()}</TableCell>
                  <TableCell>RM {payroll.deductions.toLocaleString()}</TableCell>
                  <TableCell>RM {payroll.epfAmount.toLocaleString()}</TableCell>
                  <TableCell>RM {payroll.socsoAmount.toLocaleString()}</TableCell>
                  <TableCell>RM {payroll.taxAmount.toLocaleString()}</TableCell>
                  <TableCell className="font-medium">RM {payroll.netSalary.toLocaleString()}</TableCell>
                  <TableCell>
                    {payroll.paidAt ? (
                      <Badge variant="default">Paid</Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/payroll/${payroll.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      {canManagePayroll && !payroll.paidAt && (
                        <Button variant="ghost" size="sm" onClick={() => markAsPaid(payroll.id)}>
                          Mark Paid
                        </Button>
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
            {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} payroll records
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
