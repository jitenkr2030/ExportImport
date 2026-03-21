'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ArrowLeft, 
  AlertTriangle,
  Download,
  Eye
} from 'lucide-react'
import Link from 'next/link'

export default function Verification() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [company, setCompany] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadForm, setUploadForm] = useState({
    type: 'BUSINESS_LICENSE',
    fileUrl: '',
    fileName: ''
  })

  const documentTypes = [
    { value: 'BUSINESS_LICENSE', label: 'Business License' },
    { value: 'GST', label: 'GST Certificate' },
    { value: 'IEC', label: 'IEC Code' },
    { value: 'CERTIFICATE', label: 'Other Certificate' },
    { value: 'OTHER', label: 'Other Document' }
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchCompanyData()
      fetchDocuments()
    }
  }, [session])

  const fetchCompanyData = async () => {
    try {
      const response = await fetch('/api/company/my-company')
      if (response.ok) {
        const data = await response.json()
        setCompany(data)
      } else if (response.status === 404) {
        router.push('/dashboard/company/create')
      }
    } catch (error) {
      console.error('Failed to fetch company:', error)
    }
  }

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/verification/my-documents')
      if (response.ok) {
        const data = await response.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setUploadForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/document', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setUploadForm(prev => ({
          ...prev,
          fileUrl: data.url,
          fileName: file.name
        }))
      } else {
        setError('Failed to upload file')
      }
    } catch (error) {
      setError('An error occurred during file upload')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!uploadForm.fileUrl || !uploadForm.fileName) {
      setError('Please upload a document')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/verification/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(uploadForm),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Document uploaded successfully!')
        setUploadForm({ type: 'BUSINESS_LICENSE', fileUrl: '', fileName: '' })
        fetchDocuments()
        fetchCompanyData() // Refresh company data to update verification status
      } else {
        setError(data.error || 'Failed to upload document')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'REJECTED': return <XCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Company Profile Required</CardTitle>
            <CardDescription>
              You need to create a company profile before accessing verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/company/create">
              <Button className="w-full">Create Company Profile</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="font-semibold">Verification Center</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Company Verification Status</span>
              <Badge className={getStatusColor(company.verificationStatus)}>
                {getStatusIcon(company.verificationStatus)}
                <span className="ml-1">{company.verificationStatus}</span>
              </Badge>
            </CardTitle>
            <CardDescription>
              Get verified to build trust with potential buyers and increase your visibility.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <FileText className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <h4 className="font-medium">Upload Documents</h4>
                <p className="text-sm text-gray-600">Submit verification documents</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                <h4 className="font-medium">Review Process</h4>
                <p className="text-sm text-gray-600">Admin review and approval</p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <h4 className="font-medium">Get Verified</h4>
                <p className="text-sm text-gray-600">Receive verified badge</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upload">Upload Documents</TabsTrigger>
            <TabsTrigger value="documents">My Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Verification Document</CardTitle>
                <CardDescription>
                  Upload official documents to verify your company identity and legitimacy.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select value={uploadForm.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Upload Document</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        id="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="file" className="cursor-pointer">
                        <Button type="button" variant="outline" asChild>
                          <span>Choose File</span>
                        </Button>
                      </label>
                      <p className="text-sm text-gray-500 mt-2">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </div>

                    {uploadForm.fileName && (
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm">{uploadForm.fileName}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !uploadForm.fileUrl}
                  >
                    {isLoading ? 'Uploading...' : 'Submit Document'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>My Documents</CardTitle>
                <CardDescription>
                  Track the status of your verification documents.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No documents uploaded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <h4 className="font-medium">{doc.fileName}</h4>
                              <Badge className={getStatusColor(doc.status)}>
                                {getStatusIcon(doc.status)}
                                <span className="ml-1">{doc.status}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Type: {doc.type} • Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}