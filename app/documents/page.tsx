"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText, ImageIcon, Download, Trash2, Plus } from "lucide-react"

interface Document {
  id: number
  name: string
  type: string
  key: string
  url: string
  uploadedAt: string
  employee: {
    employeeId: string
    firstName: string
    lastName: string
    department: string
  }
}

export default function DocumentsPage() {
  const { data: session } = useSession()
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])

  const canManageDocuments = ["ADMIN", "HR"].includes(session?.user.role || "")

  useEffect(() => {
    fetchDocuments()
    if (canManageDocuments) {
      fetchEmployees()
    }
  }, [typeFilter])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(typeFilter !== "all" && { type: typeFilter }),
      })

      const response = await fetch(`/api/documents?${params}`)
      const data = await response.json()

      if (response.ok) {
        setDocuments(data.documents)
      }
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees?limit=1000")
      const data = await response.json()

      if (response.ok) {
        setEmployees(data.employees)
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    }
  }

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUploading(true)

    const formData = new FormData(event.currentTarget)

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        setUploadDialogOpen(false)
        fetchDocuments()
        // Reset form
        ;(event.target as HTMLFormElement).reset()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to upload document")
      }
    } catch (error) {
      console.error("Error uploading document:", error)
      alert("Failed to upload document")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (documentId: number) => {
    if (!confirm("Are you sure you want to delete this document?")) return

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchDocuments()
      }
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const handleDownload = (document: Document) => {
    // Create a temporary link to download the file
    const link = document.createElement("a")
    link.href = document.url
    link.download = document.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const getDocumentTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      "ID Card": "bg-blue-100 text-blue-800",
      Passport: "bg-green-100 text-green-800",
      Resume: "bg-purple-100 text-purple-800",
      Contract: "bg-orange-100 text-orange-800",
      Certificate: "bg-yellow-100 text-yellow-800",
      Medical: "bg-red-100 text-red-800",
      Other: "bg-gray-100 text-gray-800",
    }

    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || colors.Other}`}>{type}</span>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading documents...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Manage employee documents and files</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <Label htmlFor="name">Document Name</Label>
                <Input id="name" name="name" required placeholder="e.g., John Doe - ID Card" />
              </div>

              {canManageDocuments && (
                <div>
                  <Label htmlFor="employeeId">Employee</Label>
                  <Select name="employeeId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.firstName} {employee.lastName} ({employee.employeeId})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {!canManageDocuments && <input type="hidden" name="employeeId" value={session?.user.employeeId} />}

              <div>
                <Label htmlFor="type">Document Type</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ID Card">ID Card</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                    <SelectItem value="Resume">Resume</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Medical">Medical Certificate</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  required
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG, GIF (max 10MB)
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ID Card">ID Card</SelectItem>
                <SelectItem value="Passport">Passport</SelectItem>
                <SelectItem value="Resume">Resume</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Certificate">Certificate</SelectItem>
                <SelectItem value="Medical">Medical Certificate</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
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
                <TableHead>Document</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getFileIcon(document.type)}
                      <div>
                        <div className="font-medium">{document.name}</div>
                        <div className="text-sm text-muted-foreground">{document.key}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {document.employee.firstName} {document.employee.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {document.employee.employeeId} • {document.employee.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getDocumentTypeBadge(document.type)}</TableCell>
                  <TableCell>{new Date(document.uploadedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleDownload(document)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      {canManageDocuments && (
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(document.id)}>
                          <Trash2 className="h-4 w-4" />
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

      {documents.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-muted-foreground mb-4">Upload your first document to get started.</p>
            <Button onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
