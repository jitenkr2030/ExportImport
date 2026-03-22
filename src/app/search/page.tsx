'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Search, Filter, Globe, Package, Building, Star, CheckCircle, X, SlidersHorizontal } from 'lucide-react'
import Link from 'next/link'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<any[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    country: 'all',
    category: 'all',
    minPrice: 0,
    maxPrice: 10000,
    verifiedOnly: false,
    sortBy: 'relevance'
  })

  const countries = [
    'All Countries', 'United States', 'China', 'India', 'Brazil', 'Germany', 'Japan', 
    'United Kingdom', 'France', 'Italy', 'Canada', 'South Korea', 'Spain', 'Mexico'
  ]

  const categories = [
    'All Categories', 'Agriculture', 'Textiles', 'Machinery', 'Chemicals', 
    'Electronics', 'Food & Beverage', 'Construction', 'Automotive', 'Healthcare'
  ]

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  useEffect(() => {
    performSearch()
  }, [searchQuery, filters, activeTab])

  const performSearch = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filters.country !== 'all') params.append('country', filters.country)
      if (filters.category !== 'all') params.append('category', filters.category)
      if (filters.verifiedOnly) params.append('verified', 'true')
      params.append('limit', '50')

      const endpoint = activeTab === 'products' ? '/api/products/all' : '/api/companies/all'
      const response = await fetch(`${endpoint}?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        if (activeTab === 'products') {
          setProducts(data)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch()
  }

  const clearFilters = () => {
    setFilters({
      country: 'all',
      category: 'all',
      minPrice: 0,
      maxPrice: 10000,
      verifiedOnly: false,
      sortBy: 'relevance'
    })
  }

  const activeFiltersCount = Object.values(filters).filter((value, index) => 
    index < 5 && value !== 'all' && value !== 0 && value !== false
  ).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">ExportImport</span>
            </Link>
            
            <div className="flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for products, companies, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                />
                <Button type="submit" size="sm" className="absolute right-1 top-1">
                  Search
                </Button>
              </form>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
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
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Country Filter */}
                  <div>
                    <Label>Country</Label>
                    <Select value={filters.country} onValueChange={(value) => setFilters(prev => ({ ...prev, country: value }))}>
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
                    <Label>Category</Label>
                    <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
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

                  {/* Price Range (for products) */}
                  {activeTab === 'products' && (
                    <div>
                      <Label>Price Range</Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">${filters.minPrice}</span>
                          <span className="text-sm text-gray-600">${filters.maxPrice}</span>
                        </div>
                        <Slider
                          value={[filters.minPrice, filters.maxPrice]}
                          onValueChange={(value) => setFilters(prev => ({ 
                            ...prev, 
                            minPrice: value[0], 
                            maxPrice: value[1] 
                          }))}
                          max={10000}
                          step={100}
                          className="w-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* Verified Only */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={filters.verifiedOnly}
                      onCheckedChange={(checked) => setFilters(prev => ({ ...prev, verifiedOnly: checked }))}
                    />
                    <Label htmlFor="verified" className="text-sm">
                      Verified companies only
                    </Label>
                  </div>

                  {/* Sort By */}
                  <div>
                    <Label>Sort By</Label>
                    <Select value={filters.sortBy} onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}>
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
            {/* Results Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {searchQuery ? `Results for "${searchQuery}"` : 'Browse All'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {activeTab === 'products' 
                      ? `${products.length} products found`
                      : `${companies.length} companies found`
                    }
                  </p>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="products">Products</TabsTrigger>
                    <TabsTrigger value="companies">Companies</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Searching...</p>
              </div>
            )}

            {/* Products Results */}
            {!isLoading && activeTab === 'products' && (
              <div className="space-y-4">
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search terms</p>
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
                            <Button size="sm" className="flex-1">
                              Contact Supplier
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
            )}

            {/* Companies Results */}
            {!isLoading && activeTab === 'companies' && (
              <div className="space-y-4">
                {companies.length === 0 ? (
                  <div className="text-center py-12">
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
                    <p className="text-gray-600">Try adjusting your filters or search terms</p>
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
                          <CardDescription className="mb-4">{company.description}</CardDescription>
                          
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">4.5</span>
                              <span className="text-sm text-gray-500">(127)</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              {company._count?.products || 0} products
                            </div>
                          </div>

                          <div className="flex space-x-2">
                            <Button size="sm" className="flex-1">
                              Contact
                            </Button>
                            <Button size="sm" variant="outline">
                              View Profile
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}