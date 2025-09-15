"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building, Shield, Bell, Database, Users, DollarSign } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSave = async (section: string) => {
    setLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    toast({
      title: "Settings saved",
      description: `${section} settings have been updated successfully.`,
    })
  }

  return (
    <DashboardLayout title="Settings">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">System Settings</h1>
            <p className="text-muted-foreground">Manage your HRMS configuration and preferences</p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Shield className="w-3 h-3 mr-1" />
            Admin Only
          </Badge>
        </div>

        <Tabs defaultValue="company" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* Company Settings */}
          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Company Information
                </CardTitle>
                <CardDescription>Update your company details and registration information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="Tech Solutions Sdn Bhd" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registration-no">Registration Number</Label>
                    <Input id="registration-no" defaultValue="201901234567" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    defaultValue="Level 10, Menara ABC, Jalan Bukit Bintang, 55100 Kuala Lumpur"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+60 3-2123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="hr@techsolutions.com.my" />
                  </div>
                </div>

                <Button onClick={() => handleSave("Company")} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payroll Settings */}
          <TabsContent value="payroll" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Malaysian Payroll Configuration
                </CardTitle>
                <CardDescription>Configure EPF, SOCSO, EIS, and tax settings for Malaysian compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">EPF Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="epf-employer">Employer Contribution (%)</Label>
                      <Input id="epf-employer" type="number" defaultValue="12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="epf-employee">Employee Contribution (%)</Label>
                      <Input id="epf-employee" type="number" defaultValue="11" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">SOCSO Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="socso-employer">Employer Rate (%)</Label>
                      <Input id="socso-employer" type="number" defaultValue="1.75" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socso-employee">Employee Rate (%)</Label>
                      <Input id="socso-employee" type="number" defaultValue="0.5" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">EIS Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="eis-rate">EIS Rate (%)</Label>
                      <Input id="eis-rate" type="number" defaultValue="0.2" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Tax Settings</h4>
                    <div className="space-y-2">
                      <Label htmlFor="tax-relief">Personal Relief (RM)</Label>
                      <Input id="tax-relief" type="number" defaultValue="9000" />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave("Payroll")} disabled={loading}>
                  {loading ? "Saving..." : "Save Payroll Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure system notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Leave Requests</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify managers when employees submit leave requests
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Payroll Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Send reminders before payroll processing deadlines
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Document Expiry</Label>
                      <p className="text-sm text-muted-foreground">Alert when employee documents are about to expire</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>System Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about system updates and maintenance
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <Button onClick={() => handleSave("Notifications")} disabled={loading}>
                  {loading ? "Saving..." : "Save Notification Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <CardDescription>Configure user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-approve Leave Requests</Label>
                      <p className="text-sm text-muted-foreground">Automatically approve leave requests under 3 days</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Employee Self-Service</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow employees to update their personal information
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Manager Dashboard Access</Label>
                      <p className="text-sm text-muted-foreground">
                        Give managers access to team analytics and reports
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Default User Roles</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="default-role">New Employee Default Role</Label>
                      <select className="w-full p-2 border rounded-md bg-background">
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="probation-period">Probation Period (months)</Label>
                      <Input id="probation-period" type="number" defaultValue="3" />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave("User Management")} disabled={loading}>
                  {loading ? "Saving..." : "Save User Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Settings */}
          <TabsContent value="system" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>Advanced system settings and maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <select className="w-full p-2 border rounded-md bg-background">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="60" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-file-size">Maximum File Upload Size (MB)</Label>
                    <Input id="max-file-size" type="number" defaultValue="10" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">System Maintenance</h4>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button variant="outline">Clear Cache</Button>
                    <Button variant="outline">Export Logs</Button>
                  </div>
                </div>

                <Button onClick={() => handleSave("System")} disabled={loading}>
                  {loading ? "Saving..." : "Save System Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
