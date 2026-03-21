'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, Building, Package, Globe, Star, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import Link from 'next/link'

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'all' | 'companies' | 'products'>('all')
  const [results, setResults] = useState({ companies: [], products: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')

  const countries = ['All Countries', 'United States', 'China', 'India', 'Brazil', 'Germany', 'Japan', 'United Kingdom', 'France', 'Italy', 'Canada', 'South Korea']
  const categories = ['All Categories', 'Agriculture', 'Textiles', 'Machinery', 'Chemicals', 'Electronics', 'Food & Beverage']
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'verified', label: 'Verified First' }
  ]

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch()
    }
  }, [searchQuery, selectedCountry, selectedCategory, priceRange, verifiedOnly, sortBy])

  const performSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        country: selectedCountry === 'All Countries' ? 'all' : selectedCountry,
        category: selectedCategory === 'All Categories' ? 'all' : selectedCategory,
        minPrice: priceRange[0].toString(),
        maxPrice: priceRange[1].toString(),
        verifiedOnly: verifiedOnly.toString(),
        sortBy
      })

      const response = await fetch(`/api/search?${params}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
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
    setSelectedCountry('all')
    setSelectedCategory('all')
    setPriceRange([0, 10000])
    setVerifiedOnly(false)
    setSortBy('relevance')
  }

  const activeFiltersCount = [
    selectedCountry !== 'all',
    selectedCategory !== 'all',
    priceRange[0] > 0 || priceRange[1] < 10000,
    verifiedOnly
  ].filter(Boolean).length

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
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for companies, products, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 text-lg h-12"
                />
              </div>
              <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            <Tabs value={searchType} onValueChange={(value) => setSearchType(value as any)}>
              <TabsList>
                <TabsTrigger value="all">All Results</TabsTrigger>
                <TabsTrigger value="companies">Companies</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
              </TabsList>
            </Tabs>
          </form>
        </div>

        {/* Filters Panel */}
        {filtersOpen && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Search Filters</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFiltersOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Country Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Country</label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                </div>

                {/* Additional Filters */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="verified"
                      checked={verifiedOnly}
                      onCheckedChange={setVerifiedOnly}
                    />
                    <label htmlFor="verified" className="text-sm font-medium">
                      Verified Only
                    </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
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
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Searching...</p>
          </div>
        ) : searchQuery.trim() ? (
          <div className="space-y-8">
            {/* Companies Results */}
            {(searchType === 'all' || searchType === 'companies') && results.companies?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Companies ({results.companies.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.companies.map((company: any) => (
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
                              <Star className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="mb-4">{company.description}</CardDescription>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            <MessageSquare className="w-4 h-4 mr-2" />
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
              </div>
            )}

            {/* Products Results */}
            {(searchType === 'all' || searchType === 'products') && results.products?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Products ({results.products.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.products.map((product: any) => (
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
                              <Star className="w-3 h-3 mr-1" />
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
              </div>
            )}

            {/* No Results */}
            {results.companies?.length === 0 && results.products?.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start your search</h3>
            <p className="text-gray-600">
              Enter keywords above to find companies and products
            </p>
          </div>
        )}
      </div>
    </div>
  )
}