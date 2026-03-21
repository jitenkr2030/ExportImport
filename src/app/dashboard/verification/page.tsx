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
import { Upload, FileText, CheckCircle, Clock, AlertCircle, ArrowLeft, Eye, Download, Trash2 } from 'lucide-react'
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
    { value: 'GST', label: 'GST Registration' },
    { value: 'IEC', label: 'Import Export Code' },
    { value: 'CERTIFICATE', label: 'Certificate of Incorporation' },
    { value: 'OTHER', label: 'Other Document' }
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchCompany()
      fetchDocuments()
    }
  }, [session])

  const fetchCompany = async () => {
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

      const data = await response.json()

      if (response.ok) {
        setUploadForm(prev => ({
          ...prev,
          fileUrl: data.fileUrl,
          fileName: file.name
        }))
      } else {
        setError(data.error || 'Failed to upload file')
      }
    } catch (error) {
      setError('Failed to upload file')
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
      setError('Please upload a file')
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
        
        // Reset file input
        const fileInput = document.getElementById('file-upload') as HTMLInputElement
        if (fileInput) fileInput.value = ''
      } else {
        setError(data.error || 'Failed to upload document')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
              You need to create a company profile before uploading verification documents.
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Company Verification</h1>
          <p className="text-gray-600 mt-2">
            Upload verification documents to build trust with potential buyers and get verified badge.
          </p>
        </div>

        {/* Company Verification Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Verification Status</span>
              {getStatusBadge(company.verificationStatus)}
            </CardTitle>
            <CardDescription>
              {company.isVerified 
                ? "Your company is verified! You'll appear higher in search results."
                : "Upload documents to get your company verified."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-blue-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium">Build Trust</h4>
                <p className="text-sm text-gray-600">Verified companies get more inquiries</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium">Higher Visibility</h4>
                <p className="text-sm text-gray-600">Appear at the top of search results</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium">Credibility Badge</h4>
                <p className="text-sm text-gray-600">Show verification badge on your profile</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Document Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Verification Document</CardTitle>
            <CardDescription>
              Upload official business documents for verification. Accepted formats: PDF, JPG, PNG (Max 10MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="document-type">Document Type</Label>
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
                <Label htmlFor="file-upload">Upload Document</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        {uploadForm.fileName ? uploadForm.fileName : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, JPG, PNG up to 10MB
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !uploadForm.fileUrl}
              >
                {isLoading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Uploaded Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              Track the status of your verification documents
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{doc.fileName}</h4>
                          <p className="text-sm text-gray-500">
                            {documentTypes.find(t => t.value === doc.type)?.label} • 
                            Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(doc.status)}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
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
      </div>
    </div>
  )
}