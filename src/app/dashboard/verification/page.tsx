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
import { Upload, FileText, CheckCircle, Clock, AlertCircle, ArrowLeft, Eye, Download } from 'lucide-react'
import Link from 'next/link'

interface Document {
  id: string
  type: string
  fileName: string
  fileUrl: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
}

export default function Verification() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [company, setCompany] = useState<any>(null)
  const [documents, setDocuments] = useState<Document[]>([])
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
    { value: 'IEC', label: 'Import Export Code (IEC)' },
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError('')

    try {
      // For demo purposes, we'll use a placeholder URL
      // In production, you'd upload to a file storage service
      const formData = new FormData()
      formData.append('file', file)

      // Simulate upload - replace with actual upload logic
      setTimeout(() => {
        setUploadForm(prev => ({
          ...prev,
          fileName: file.name,
          fileUrl: `/uploads/${file.name}` // Placeholder URL
        }))
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      setError('Failed to upload file')
      setIsLoading(false)
    }
  }

  const handleSubmitDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!uploadForm.fileName || !uploadForm.fileUrl) {
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
        
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(data.error || 'Failed to upload document')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'REJECTED':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
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
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(company.verificationStatus)}
              <span>Verification Status</span>
            </CardTitle>
            <CardDescription>
              Get verified to build trust with potential buyers and sellers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusBadge(company.verificationStatus)}
                </div>
                <p className="text-sm text-gray-600">
                  {company.verificationStatus === 'APPROVED' && 'Your company is verified! You can enjoy all platform benefits.'}
                  {company.verificationStatus === 'PENDING' && 'Your documents are under review. This usually takes 2-3 business days.'}
                  {company.verificationStatus === 'REJECTED' && 'Please review the feedback and resubmit your documents.'}
                </p>
              </div>
              {company.isVerified && (
                <CheckCircle className="w-12 h-12 text-green-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Document */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                Submit required documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitDocument} className="space-y-4">
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
                  <Select 
                    value={uploadForm.type} 
                    onValueChange={(value) => setUploadForm(prev => ({ ...prev, type: value }))}
                  >
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
                  <Label htmlFor="file">Upload File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileUpload}
                      className="max-w-xs mx-auto"
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                </div>

                {uploadForm.fileName && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Selected File:</p>
                    <p className="text-sm text-blue-700">{uploadForm.fileName}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !uploadForm.fileName}
                >
                  {isLoading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Uploaded Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>
                Track the status of your submitted documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No documents uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(doc.status)}
                          <span className="font-medium">{doc.fileName}</span>
                        </div>
                        {getStatusBadge(doc.status)}
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        Type: {documentTypes.find(t => t.value === doc.type)?.label}
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-3">
                        Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Verification Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Verification Guidelines</CardTitle>
            <CardDescription>
              Required documents and verification process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Required Documents:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Business License / Registration Certificate</li>
                  <li>• GST Registration (if applicable)</li>
                  <li>• Import Export Code (IEC)</li>
                  <li>• Certificate of Incorporation</li>
                  <li>• Address Proof</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Verification Process:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Upload clear, readable documents</li>
                  <li>• Documents are reviewed within 2-3 business days</li>
                  <li>• You'll receive email notifications</li>
                  <li>• Approved companies get verified badge</li>
                  <li>• Higher visibility in search results</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}