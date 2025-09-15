"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, Calendar, DollarSign, FileText, Shield } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (session) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Building className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">HRMS Malaysia</h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Complete Human Resource Management System designed for Malaysian businesses with built-in EPF, SOCSO, and
            tax compliance.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">
                <Shield className="mr-2 h-5 w-5" />
                Login to System
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                Employee Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Complete employee lifecycle management with NRIC validation, department organization, and role-based
                access control.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                Payroll & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Automated payroll processing with Malaysian EPF, SOCSO, and progressive tax calculations built-in.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                Leave Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Comprehensive leave tracking with Malaysian leave types, approval workflows, and balance management.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-orange-600" />
                Document Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Secure document storage for employee files, contracts, certificates, and compliance documents.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                Role-Based Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Multi-level access control with Admin, HR, Manager, and Employee roles for data security and privacy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6 text-indigo-600" />
                Malaysian Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Built specifically for Malaysian businesses with local statutory requirements and compliance features.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Login Section */}
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Access Your HRMS</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Login with your employee credentials to access the system.
            </p>
            <Button asChild className="w-full">
              <Link href="/login">Login to Dashboard</Link>
            </Button>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p>Demo Credentials:</p>
              <p>Admin: admin@techsolutions.com.my / admin123</p>
              <p>HR: hr@techsolutions.com.my / hr123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
