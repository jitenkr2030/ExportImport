'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import ReviewList from '@/components/ReviewList'
import NotificationCenter from '@/components/NotificationCenter'
import { 
  Building, 
  Package, 
  MessageSquare, 
  Star, 
  TrendingUp, 
  Users, 
  Eye,
  Plus,
  Edit,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Shield,
  FileText,
  Bell
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [companyData, setCompanyData] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalViews: 1234,
    totalInquiries: 45,
    totalProducts: 0,
    avgRating: 4.5
  })

  const fetchCompanyData = async () => {
    if (isLoading) return // Prevent duplicate calls
    
    setIsLoading(true)
    try {
      const response = await fetch('/api/company/my-company')
      if (response.ok) {
        const data = await response.json()
        setCompanyData(data)
        setStats(prev => ({ ...prev, totalProducts: data._count.products }))
      }
    } catch (error) {
      console.error('Failed to fetch company data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/my-products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
        setStats(prev => ({ ...prev, totalProducts: data.length }))
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/inquiries/my-inquiries')
      if (response.ok) {
        const data = await response.json()
        setInquiries(data)
        setStats(prev => ({ ...prev, totalInquiries: data.length }))
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error)
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    if (session && !companyData && !isLoading) {
      fetchCompanyData()
      fetchProducts()
      fetchInquiries()
    }
  }, [session, companyData, isLoading])

  const companyDataValue = session?.user?.company || companyData

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

  const hasCompany = companyDataValue !== null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">ExportImport</span>
                    {companyDataValue && !companyDataValue.isVerified && (
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                        <Clock className="w-3 h-3 mr-1" />
                        Not Verified
                      </Badge>
                    )}
                  </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session.user.name}</span>
              <NotificationCenter />
              <Avatar>
                <AvatarImage src={session.user.image || ''} />
                <AvatarFallback>{session.user.name?.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" onClick={() => router.push('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your company profile and track your business performance</p>
        </div>

        {!hasCompany ? (
          /* No Company Profile */
          <Card className="mb-8">
            <CardHeader className="text-center">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <CardTitle>Create Your Company Profile</CardTitle>
              <CardDescription>
                Start by creating your company profile to showcase your business to global buyers and sellers
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" onClick={() => router.push('/dashboard/company/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Create Company Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Has Company Profile */
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Profile Views</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Inquiries</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Company Info Card */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={companyDataValue.logo || ''} />
                      <AvatarFallback className="text-lg">
                        {companyDataValue.name?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{companyDataValue.name}</span>
                        {companyDataValue.isVerified ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            <Clock className="w-3 h-3 mr-1" />
                            Pending Verification
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {companyDataValue.country} • {companyDataValue.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => router.push('/dashboard/company/edit')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/dashboard/verification')}>
                      <Upload className="w-4 h-4 mr-2" />
                      Verification
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{companyDataValue.description}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{companyDataValue.country}</Badge>
                  {companyDataValue.phone && <Badge variant="outline">{companyDataValue.phone}</Badge>}
                  {companyDataValue.whatsapp && <Badge variant="outline">WhatsApp: {companyDataValue.whatsapp}</Badge>}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your product listings</CardDescription>
                  </div>
                  {hasCompany && (
                    <Button onClick={() => router.push('/dashboard/products/create')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Product
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!hasCompany ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Create a company profile to start adding products</p>
                    <Button onClick={() => router.push('/dashboard/company/create')}>
                      Create Company Profile
                    </Button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No products yet. Add your first product to get started.</p>
                    <Button onClick={() => router.push('/dashboard/products/create')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              {product.price && (
                                <span className="text-green-600 font-medium">
                                  {product.currency} {product.price}
                                </span>
                              )}
                              {product.moq && (
                                <span className="text-sm text-gray-500">
                                  MOQ: {product.moq} units
                                </span>
                              )}
                              <span className="text-sm text-gray-500">
                                {product._count.inquiries} inquiries
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                            <Button variant="outline" size="sm">
                              View
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

          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>View and respond to customer inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                {!hasCompany ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Create a company profile to receive inquiries</p>
                    <Button onClick={() => router.push('/dashboard/company/create')}>
                      Create Company Profile
                    </Button>
                  </div>
                ) : inquiries.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No inquiries yet. They will appear here when customers contact you.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                      <div key={inquiry.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              Inquiry from {inquiry.sender.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {inquiry.sender.email} • {new Date(inquiry.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={inquiry.status === 'OPEN' ? 'default' : 'secondary'}>
                            {inquiry.status}
                          </Badge>
                        </div>
                        
                        {inquiry.product && (
                          <div className="mb-3 p-2 bg-gray-50 rounded">
                            <span className="text-sm font-medium">Product: </span>
                            <span className="text-sm">{inquiry.product.name}</span>
                          </div>
                        )}
                        
                        <p className="text-gray-700 mb-3">{inquiry.message}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          {inquiry.quantity && (
                            <span>Quantity: {inquiry.quantity}</span>
                          )}
                          {inquiry.budget && (
                            <span>Budget: {inquiry.currency} {inquiry.budget}</span>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Respond
                          </Button>
                          {inquiry.company.phone && (
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-2" />
                              Call
                            </Button>
                          )}
                          {inquiry.company.whatsapp && (
                            <Button size="sm" variant="outline" className="text-green-600">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              WhatsApp
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Company Verification</CardTitle>
                    <CardDescription>
                      Upload documents to verify your company and build trust with buyers
                    </CardDescription>
                  </div>
                  <Button onClick={() => router.push('/dashboard/verification')}>
                    <Shield className="w-4 h-4 mr-2" />
                    Manage Verification
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {!hasCompany ? (
                  <div className="text-center py-8">
                    <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Create a company profile to start verification</p>
                    <Button onClick={() => router.push('/dashboard/company/create')}>
                      Create Company Profile
                    </Button>
                  </div>
                ) : companyDataValue.isVerified ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-600 mb-2">Verified Company</h3>
                    <p className="text-gray-600 mb-4">
                      Your company is verified and trusted by buyers worldwide.
                    </p>
                    <Button variant="outline" onClick={() => router.push('/dashboard/verification')}>
                      View Documents
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-yellow-600 mb-2">Verification Required</h3>
                    <p className="text-gray-600 mb-4">
                      Upload verification documents to get verified and increase trust with potential buyers.
                    </p>
                    <Button onClick={() => router.push('/dashboard/verification')}>
                      <Shield className="w-4 h-4 mr-2" />
                      Upload Documents
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Verification Status</CardTitle>
                    <CardDescription>Manage your company verification documents</CardDescription>
                  </div>
                  <Button onClick={() => router.push('/dashboard/verification')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Manage Documents
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    {companyDataValue.isVerified ? 'Verified Company' : 'Get Verified'}
                  </h4>
                  <p className="text-gray-600 mb-4">
                    {companyDataValue.isVerified 
                      ? 'Your company is verified. This builds trust with potential buyers.'
                      : 'Upload verification documents to get verified and increase your credibility.'
                    }
                  </p>
                  <Button onClick={() => router.push('/dashboard/verification')}>
                    {companyDataValue.isVerified ? 'View Documents' : 'Start Verification'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            {hasCompany ? (
              <ReviewList
                companyId={companyDataValue.id}
                companyName={companyDataValue.name}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Company Profile
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Create a company profile to receive customer reviews
                  </p>
                  <Button onClick={() => router.push('/dashboard/company/create')}>
                    Create Company Profile
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>Track your business performance and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Performance Overview</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Profile Views</span>
                        <span className="font-medium">{stats.totalViews}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Inquiry Rate</span>
                        <span className="font-medium">
                          {products.length > 0 
                            ? `${Math.round((stats.totalInquiries / (products.length * 10)) * 100)}%`
                            : '0%'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Response Time</span>
                        <span className="font-medium text-green-600">2.5 hours avg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Top Products</h4>
                    <div className="space-y-2">
                      {products.slice(0, 3).map((product, index) => (
                        <div key={product.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm font-medium truncate">{product.name}</span>
                          <span className="text-sm text-gray-600">
                            {product._count.inquiries} inquiries
                          </span>
                        </div>
                      ))}
                      {products.length === 0 && (
                        <p className="text-sm text-gray-500">No products yet</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-4">Monthly Trends</h4>
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                    <span className="text-gray-500 ml-2">Analytics chart coming soon</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences and security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive email updates about inquiries and messages</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Privacy Settings</h4>
                        <p className="text-sm text-gray-600">Control your profile visibility and data sharing</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Account Security</h4>
                        <p className="text-sm text-gray-600">Update password and security settings</p>
                      </div>
                      <Button variant="outline" size="sm">Update</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                  <CardDescription>Configure your business preferences and operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Auto-Response</h4>
                        <p className="text-sm text-gray-600">Set up automatic responses to inquiries</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Working Hours</h4>
                        <p className="text-sm text-gray-600">Set your business hours for response time estimates</p>
                      </div>
                      <Button variant="outline" size="sm">Set Hours</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Language Preferences</h4>
                        <p className="text-sm text-gray-600">Set default language for communications</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription */}
              <Card>
                <CardHeader>
                  <CardTitle>Subscription Plan</CardTitle>
                  <CardDescription>Manage your ExportImport subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-blue-900">Free Plan</h4>
                        <p className="text-sm text-blue-700">Perfect for getting started</p>
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm text-blue-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Up to 5 products
                          </div>
                          <div className="flex items-center text-sm text-blue-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Basic analytics
                          </div>
                          <div className="flex items-center text-sm text-blue-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Email support
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Upgrade Plan</Button>
                    </div>
                  </div>
                </CardContent>
                </Card>

              {/* Data & Privacy */}
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>Manage your data and privacy settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Download Your Data</h4>
                        <p className="text-sm text-gray-600">Export all your business data</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-gray-600">Permanently delete your account and data</p>
                      </div>
                      <Button variant="destructive" size="sm">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}