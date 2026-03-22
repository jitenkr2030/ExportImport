'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, Building, Package, Globe, Star, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import InquiryForm from '@/components/InquiryForm'
import Link from 'next/link'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showInquiryForm, setShowInquiryForm] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    country: 'all',
    priceRange: [0, 10000],
    verifiedOnly: false,
    category: 'all',
    sortBy: 'relevance'
  })

  const countries = ['All Countries', 'United States', 'China', 'India', 'Brazil', 'Germany', 'Japan', 'United Kingdom', 'France', 'Italy', 'Canada', 'South Korea']
  const categories = ['All Categories', 'Agriculture', 'Textiles', 'Machinery', 'Chemicals', 'Electronics', 'Food & Beverage']
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'verified', label: 'Verified First' }
  ]

  useEffect(() => {
    // Get search query from URL
    const urlParams = new URLSearchParams(window.location.search)
    const query = urlParams.get('q')
    if (query) {
      setSearchQuery(query)
    }
    fetchData()
  }, [])

  useEffect(() => {
    fetchData()
  }, [searchQuery, filters, activeTab])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filters.country !== 'all') params.append('country', filters.country)
      if (filters.verifiedOnly) params.append('verified', 'true')
      if (filters.category !== 'all') params.append('category', filters.category)
      params.append('sort', filters.sortBy)
      params.append('minPrice', filters.priceRange[0].toString())
      params.append('maxPrice', filters.priceRange[1].toString())

      const endpoint = activeTab === 'products' ? '/api/products/all' : '/api/companies/all'
      const response = await fetch(`${endpoint}?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        if (activeTab === 'products') {
          setProducts(data)
          // Extract unique companies from products
          const uniqueCompanies = Array.from(
            new Map(data.map((product: any) => [product.company.id, product.company])).values()
          )
          setCompanies(uniqueCompanies)
        } else {
          setCompanies(data)
        }
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      country: 'all',
      priceRange: [0, 10000],
      verifiedOnly: false,
      category: 'all',
      sortBy: 'relevance'
    })
  }

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    key !== 'priceRange' && value !== 'all' && value !== false && value !== 'relevance'
  ).length + (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000 ? 1 : 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search for products, companies, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="relative"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Filters</CardTitle>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Country Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Select value={filters.country} onValueChange={(value) => handleFilterChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
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

                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category === 'All Categories' ? 'all' : category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range Filter */}
                  {activeTab === 'products' && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      </label>
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => handleFilterChange('priceRange', value)}
                        max={10000}
                        step={100}
                        className="mt-4"
                      />
                    </div>
                  )}

                  {/* Verified Only Filter */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified-only"
                      checked={filters.verifiedOnly}
                      onCheckedChange={(checked) => handleFilterChange('verifiedOnly', checked)}
                    />
                    <label htmlFor="verified-only" className="text-sm font-medium">
                      Verified Companies Only
                    </label>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Sort By</label>
                    <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="products">
                  Products ({products.length})
                </TabsTrigger>
                <TabsTrigger value="companies">
                  Companies ({companies.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            )}

            {/* Products Results */}
            {!isLoading && activeTab === 'products' && (
              <>
                {showInquiryForm && selectedProduct && (
                  <div className="mb-6">
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
                              <Search className="w-4 h-4 mr-2" />
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
              </>
            )}

            {/* Companies Results */}
            {!isLoading && activeTab === 'companies' && (
              <>
                {companies.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No companies found matching your criteria.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {companies.map((company) => (
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
                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              <Search className="w-4 h-4 mr-2" />
                              View Products
                            </Button>
                            <Button size="sm" variant="outline">
                              Contact
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}