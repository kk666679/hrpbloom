"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const employeeSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nric: z.string().min(12, "NRIC must be at least 12 characters"),
  passportNo: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  dateJoined: z.string().min(1, "Date joined is required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  salary: z.string().min(1, "Salary is required"),
  epfNo: z.string().optional(),
  socsoNo: z.string().optional(),
  taxNo: z.string().optional(),
  bankAccount: z.string().optional(),
  role: z.enum(["ADMIN", "HR", "MANAGER", "EMPLOYEE"]),
})

type EmployeeFormData = z.infer<typeof employeeSchema>

export default function AddEmployeePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tempPassword, setTempPassword] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      role: "EMPLOYEE",
    },
  })

  const canManageEmployees = user?.role === "ADMIN" || user?.role === "HR"

  if (!canManageEmployees) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to add employees.</p>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: EmployeeFormData) => {
    setLoading(true)
    try {
      const response = await api.post("/employees", data)

      const result = await response.json()

      if (response.ok) {
        setTempPassword(result.tempPassword)
        setTimeout(() => {
          router.push("/employees")
        }, 3000)
      } else {
        alert(result.error || "Failed to create employee")
      }
    } catch (error) {
      console.error("Error creating employee:", error)
      alert("Failed to create employee")
    } finally {
      setLoading(false)
    }
  }

  if (tempPassword) {
    return (
      <div className="container mx-auto py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-green-600">Employee Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>The employee has been created with a temporary password:</p>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-lg font-mono">{tempPassword}</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Please share this password with the employee. They should change it on first login.
            </p>
            <p className="text-sm text-muted-foreground">Redirecting to employees list in 3 seconds...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Employees
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Employee</h1>
          <p className="text-muted-foreground">Create a new employee record in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employeeId">Employee ID *</Label>
                  <Input id="employeeId" {...register("employeeId")} placeholder="EMP001" />
                  {errors.employeeId && <p className="text-sm text-destructive">{errors.employeeId.message}</p>}
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={watch("role")} onValueChange={(value) => setValue("role", value as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMPLOYEE">Employee</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      {user?.role === "ADMIN" && (
                        <>
                          <SelectItem value="HR">HR</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" {...register("firstName")} />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" {...register("lastName")} />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nric">NRIC *</Label>
                  <Input id="nric" {...register("nric")} placeholder="123456-78-9012" />
                  {errors.nric && <p className="text-sm text-destructive">{errors.nric.message}</p>}
                </div>
                <div>
                  <Label htmlFor="passportNo">Passport No</Label>
                  <Input id="passportNo" {...register("passportNo")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
                  {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
                </div>
                <div>
                  <Label htmlFor="dateJoined">Date Joined *</Label>
                  <Input id="dateJoined" type="date" {...register("dateJoined")} />
                  {errors.dateJoined && <p className="text-sm text-destructive">{errors.dateJoined.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea id="address" {...register("address")} />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Contact & Employment Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact & Employment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" {...register("email")} placeholder="employee@company.com" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" {...register("phone")} placeholder="+60123456789" />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select value={watch("department")} onValueChange={(value) => setValue("department", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && <p className="text-sm text-destructive">{errors.department.message}</p>}
                </div>
                <div>
                  <Label htmlFor="position">Position *</Label>
                  <Input id="position" {...register("position")} />
                  {errors.position && <p className="text-sm text-destructive">{errors.position.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="salary">Monthly Salary (RM) *</Label>
                <Input id="salary" type="number" step="0.01" {...register("salary")} placeholder="5000.00" />
                {errors.salary && <p className="text-sm text-destructive">{errors.salary.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="epfNo">EPF Number</Label>
                  <Input id="epfNo" {...register("epfNo")} />
                </div>
                <div>
                  <Label htmlFor="socsoNo">SOCSO Number</Label>
                  <Input id="socsoNo" {...register("socsoNo")} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxNo">Tax File Number</Label>
                  <Input id="taxNo" {...register("taxNo")} />
                </div>
                <div>
                  <Label htmlFor="bankAccount">Bank Account</Label>
                  <Input id="bankAccount" {...register("bankAccount")} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/employees">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              "Creating..."
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Employee
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
