'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Globe, Users, Package, Star, CheckCircle, MessageSquare, TrendingUp, Shield, ArrowRight, Menu, X, Filter, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import InquiryForm from '@/components/InquiryForm'
import ReviewsDisplay from '@/components/ReviewsDisplay'

const categories = [
  { name: 'Agriculture', count: 1234, icon: '🌾' },
  { name: 'Textiles', count: 856, icon: '🧵' },
  { name: 'Machinery', count: 642, icon: '⚙️' },
  { name: 'Chemicals', count: 423, icon: '🧪' },
  { name: 'Electronics', count: 789, icon: '💻' },
  { name: 'Food & Beverage', count: 567, icon: '🍕' }
]

const countries = ['All Countries', 'India', 'China', 'Brazil', 'Germany', 'USA', 'Japan', 'Vietnam']

// Header Component
function Header({ isMobileMenuOpen, setIsMobileMenuOpen }: { 
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (open: boolean) => void 
}) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-gray-900">ExportImport</h1>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-8">
            <a href="#companies" className="text-gray-700 hover:text-blue-600 transition">Companies</a>
            <a href="#products" className="text-gray-700 hover:text-blue-600 transition">Products</a>
            <a href="#categories" className="text-gray-700 hover:text-blue-600 transition">Categories</a>
            <Link href="/search" className="text-gray-700 hover:text-blue-600 transition">
              Advanced Search
            </Link>
            <a href="#verify" className="text-gray-700 hover:text-blue-600 transition">Verify</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/signin">
              <Button variant="outline" size="sm">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Register</Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#companies" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Companies</a>
            <a href="#products" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Products</a>
            <a href="#categories" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Categories</a>
            <Link href="/search" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
              Advanced Search
            </Link>
            <a href="#verify" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Verify</a>
            <div className="pt-4 pb-2 border-t border-gray-200">
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="w-full mb-2">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="w-full">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// Hero Section Component
function HeroSection({ searchQuery, setSearchQuery, selectedCountry, setSelectedCountry, selectedCategory, setSelectedCategory }: {
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCountry: string
  setSelectedCountry: (country: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}) {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Connect Global Buyers & Sellers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your trusted platform for international trade. Find verified suppliers, 
            discover quality products, and grow your business globally.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <Input
                  placeholder="Search products, companies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="md:col-span-3">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country === 'All Countries' ? 'all' : country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1">
                <Button 
                  className="w-full" 
                  onClick={() => window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">10,000+</div>
            <div className="text-gray-600">Verified Companies</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">50,000+</div>
            <div className="text-gray-600">Products Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">150+</div>
            <div className="text-gray-600">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">$2.5B+</div>
            <div className="text-gray-600">Trade Volume</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Categories Section Component
function CategoriesSection() {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h3>
          <p className="text-gray-600">Find suppliers and products in your industry</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.name} 
              href={`/search?q=&category=${category.name}`}
              className="block"
            >
              <Card className="hover:shadow-lg transition cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h4 className="font-semibold text-gray-900 mb-1">{category.name}</h4>
                  <p className="text-sm text-gray-500">{category.count} suppliers</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// Companies Section Component
function CompaniesSection({ filteredCompanies, isLoading }: { 
  filteredCompanies: any[]
  isLoading: boolean 
}) {
  const [expandedCompany, setExpandedCompany] = useState<string | null>(null)

  if (isLoading) {
    return (
      <section id="companies" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading companies...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="companies" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Companies</h3>
          <p className="text-gray-600">Connect with verified global suppliers</p>
        </div>

        {filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No companies found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={company.logo || ''} alt={company.name} />
                        <AvatarFallback>{company.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <Globe className="w-4 h-4" />
                          <span>{company.country}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">
                            {company.avgRating || 'N/A'}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({company.reviewCount || 0})
                          </span>
                        </div>
                      </div>
                    </div>
                    {company.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-2 mb-4">
                    <Button size="sm" className="flex-1">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setExpandedCompany(
                        expandedCompany === company.id ? null : company.id
                      )}
                    >
                      {expandedCompany === company.id ? 'Hide' : 'Reviews'}
                    </Button>
                  </div>
                  
                  {expandedCompany === company.id && (
                    <div className="mt-4 pt-4 border-t">
                      <ReviewsDisplay 
                        companyId={company.id} 
                        companyName={company.name}
                        showWriteReview={false}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Products Section Component
function ProductsSection({ products, isLoading }: { 
  products: any[]
  isLoading: boolean 
}) {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showInquiryForm, setShowInquiryForm] = useState(false)

  if (isLoading) {
    return (
      <section id="products" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="products" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h3>
          <p className="text-gray-600">Discover quality products from verified suppliers</p>
        </div>

        {showInquiryForm && selectedProduct && (
          <div className="mb-8">
            <InquiryForm
              companyId={selectedProduct.company.id}
              productId={selectedProduct.id}
              productName={selectedProduct.name}
              companyName={selectedProduct.company.name}
              onInquirySent={() => {
                setShowInquiryForm(false)
                setSelectedProduct(null)
              }}
              onCancel={() => {
                setShowInquiryForm(false)
                setSelectedProduct(null)
              }}
            />
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <Building className="w-4 h-4" />
                        <span>{product.company.name}</span>
                        <Globe className="w-4 h-4" />
                        <span>{product.company.country}</span>
                      </div>
                    </div>
                    {product.company.isVerified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {product.images && product.images.length > 0 && (
                    <div className="mb-4">
                      <img 
                        src={product.images[0]} 
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <CardDescription className="mb-4">{product.description}</CardDescription>
                  
                  <div className="flex items-center justify-between mb-4">
                    {product.price && (
                      <span className="text-green-600 font-bold text-lg">
                        {product.currency} {product.price}
                      </span>
                    )}
                    {product.moq && (
                      <span className="text-sm text-gray-500">
                        MOQ: {product.moq}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedProduct(product)
                        setShowInquiryForm(true)
                      }}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Inquire
                    </Button>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// Features Section Component
function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ExportImport.Global</h3>
          <p className="text-gray-600">The most trusted platform for international trade</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Verified Suppliers</h4>
            <p className="text-gray-600">All companies undergo rigorous verification process</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Global Reach</h4>
            <p className="text-gray-600">Connect with businesses in 150+ countries</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Direct Communication</h4>
            <p className="text-gray-600">Chat directly with suppliers via WhatsApp</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Quality Products</h4>
            <p className="text-gray-600">Access to premium quality products worldwide</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">ExportImport</h3>
            </div>
            <p className="text-gray-400">Your trusted partner for global trade connections.</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Browse Companies</a></li>
              <li><a href="#" className="hover:text-white">Find Products</a></li>
              <li><a href="#" className="hover:text-white">Post Requirements</a></li>
              <li><a href="#" className="hover:text-white">Verification</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Safety Tips</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">About Us</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ExportImport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch products and companies on mount and when filters change
  useEffect(() => {
    fetchData()
  }, [searchQuery, selectedCountry])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // If there's a search query, use the search API
      if (searchQuery.trim()) {
        const params = new URLSearchParams()
        params.append('search', searchQuery)
        if (selectedCountry !== 'all') params.append('country', selectedCountry)
        
        const response = await fetch(`/api/search?${params}`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products || [])
          
          // Extract unique companies from products
          const uniqueCompanies = Array.from(
            new Map(data.products.map((product: any) => [product.company.id, product.company])).values()
          )
          setCompanies(uniqueCompanies)
        }
      } else {
        // Fetch all products for homepage display
        const productsResponse = await fetch('/api/products/all?limit=12')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          setProducts(productsData)
          
          // Extract unique companies from products
          const uniqueCompanies = Array.from(
            new Map(productsData.map((product: any) => [product.company.id, product.company])).values()
          )
          setCompanies(uniqueCompanies)
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />
      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <CategoriesSection />
      <CompaniesSection filteredCompanies={companies} isLoading={isLoading} />
      <ProductsSection products={products} isLoading={isLoading} />
      <FeaturesSection />
      <Footer />
    </div>
  )
}