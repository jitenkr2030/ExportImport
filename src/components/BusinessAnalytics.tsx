'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  MessageSquare, 
  Star, 
  Calendar,
  DollarSign,
  Package,
  Globe,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface AnalyticsCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease'
  icon: React.ReactNode
  description?: string
}

function AnalyticsCard({ title, value, change, changeType, icon, description }: AnalyticsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {description && (
              <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              {icon}
            </div>
            {change !== undefined && (
              <div className={`flex items-center text-sm ${
                changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {changeType === 'increase' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                <span>{Math.abs(change)}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface TopProductProps {
  name: string
  views: number
  inquiries: number
  revenue: number
  trend: 'up' | 'down'
}

function TopProduct({ name, views, inquiries, revenue, trend }: TopProductProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-sm text-gray-900 truncate">{name}</h4>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-xs text-gray-500">{views} views</span>
          <span className="text-xs text-gray-500">{inquiries} inquiries</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-medium text-gray-900">${revenue}</div>
        <div className={`flex items-center text-xs ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
        </div>
      </div>
    </div>
  )
}

interface RecentActivityProps {
  id: string
  type: 'inquiry' | 'review' | 'view'
  title: string
  description: string
  user: string
  time: string
}

function RecentActivity({ type, title, description, user, time }: RecentActivityProps) {
  const getActivityIcon = () => {
    switch (type) {
      case 'inquiry':
        return <MessageSquare className="w-4 h-4 text-blue-600" />
      case 'review':
        return <Star className="w-4 h-4 text-yellow-500" />
      case 'view':
        return <Eye className="w-4 h-4 text-green-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition">
      <div className="p-2 bg-gray-100 rounded-full">
        {getActivityIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{user}</span>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  )
}

export default function BusinessAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [isLoading, setIsLoading] = useState(false)

  // Mock analytics data
  const analyticsData = {
    '7d': {
      views: 2456,
      viewsChange: 12.5,
      inquiries: 89,
      inquiriesChange: 8.3,
      revenue: 45678,
      revenueChange: 15.2,
      conversionRate: 3.6,
      conversionChange: -2.1,
      avgResponseTime: 2.3,
      responseChange: -5.4
    },
    '30d': {
      views: 12456,
      viewsChange: 18.7,
      inquiries: 423,
      inquiriesChange: 22.1,
      revenue: 234567,
      revenueChange: 28.9,
      conversionRate: 3.4,
      conversionChange: 5.6,
      avgResponseTime: 2.1,
      responseChange: -8.7
    },
    '90d': {
      views: 45678,
      viewsChange: 25.3,
      inquiries: 1234,
      inquiriesChange: 31.2,
      revenue: 678901,
      revenueChange: 42.7,
      conversionRate: 2.7,
      conversionChange: -3.4,
      avgResponseTime: 2.5,
      responseChange: 4.2
    },
    '1y': {
      views: 156789,
      viewsChange: 45.8,
      inquiries: 5678,
      inquiriesChange: 67.3,
      revenue: 2345678,
      revenueChange: 78.9,
      conversionRate: 3.6,
      conversionChange: 12.5,
      avgResponseTime: 2.2,
      responseChange: -12.3
    }
  }

  const currentData = analyticsData[timeRange]

  const topProducts: TopProductProps[] = [
    {
      name: "Premium Cotton T-Shirts",
      views: 1234,
      inquiries: 45,
      revenue: 12345,
      trend: 'up'
    },
    {
      name: "Industrial Machinery Parts",
      views: 987,
      inquiries: 23,
      revenue: 9876,
      trend: 'up'
    },
    {
      name: "Organic Coffee Beans",
      views: 876,
      inquiries: 34,
      revenue: 8765,
      trend: 'down'
    },
    {
      name: "Electronic Components",
      views: 654,
      inquiries: 19,
      revenue: 6543,
      trend: 'up'
    }
  ]

  const recentActivities: RecentActivityProps[] = [
    {
      id: '1',
      type: 'inquiry',
      title: 'New inquiry received',
      description: 'For Premium Cotton T-Shirts',
      user: 'John Smith',
      time: '2 minutes ago'
    },
    {
      id: '2',
      type: 'review',
      title: 'New 5-star review',
      description: 'Great quality and fast delivery!',
      user: 'Sarah Johnson',
      time: '15 minutes ago'
    },
    {
      id: '3',
      type: 'view',
      title: 'Profile viewed',
      description: 'From United States',
      user: 'Mike Davis',
      time: '1 hour ago'
    },
    {
      id: '4',
      type: 'inquiry',
      title: 'Inquiry responded',
      description: 'For Industrial Machinery Parts',
      user: 'You',
      time: '2 hours ago'
    }
  ]

  const timeRanges = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Business Analytics</h3>
          <p className="text-sm text-gray-500">Track your performance and growth</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard
          title="Profile Views"
          value={currentData.views.toLocaleString()}
          change={currentData.viewsChange}
          changeType={currentData.viewsChange > 0 ? 'increase' : 'decrease'}
          icon={<Eye className="w-5 h-5 text-blue-600" />}
          description="Total profile visits"
        />
        <AnalyticsCard
          title="Inquiries"
          value={currentData.inquiries}
          change={currentData.inquiriesChange}
          changeType={currentData.inquiriesChange > 0 ? 'increase' : 'decrease'}
          icon={<MessageSquare className="w-5 h-5 text-green-600" />}
          description="Customer inquiries"
        />
        <AnalyticsCard
          title="Revenue"
          value={`$${currentData.revenue.toLocaleString()}`}
          change={currentData.revenueChange}
          changeType={currentData.revenueChange > 0 ? 'increase' : 'decrease'}
          icon={<DollarSign className="w-5 h-5 text-purple-600" />}
          description="Total revenue generated"
        />
        <AnalyticsCard
          title="Conversion Rate"
          value={`${currentData.conversionRate}%`}
          change={currentData.conversionChange}
          changeType={currentData.conversionChange > 0 ? 'increase' : 'decrease'}
          icon={<TrendingUp className="w-5 h-5 text-orange-600" />}
          description="Views to inquiries"
        />
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Views, inquiries, and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive chart coming soon</p>
                <p className="text-xs text-gray-400 mt-1">Will show performance trends over time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Where your customers are from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">World map coming soon</p>
                <p className="text-xs text-gray-400 mt-1">Will show customer locations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
            <CardDescription>Your best-selling products this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <TopProduct key={index} {...product} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentActivities.map((activity) => (
                <RecentActivity key={activity.id} {...activity} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Avg Response Time"
          value={`${currentData.avgResponseTime}h`}
          change={currentData.responseChange}
          changeType={currentData.responseChange < 0 ? 'increase' : 'decrease'}
          icon={<Clock className="w-5 h-5 text-indigo-600" />}
          description="Time to respond to inquiries"
        />
        <AnalyticsCard
          title="Active Products"
          value="12"
          icon={<Package className="w-5 h-5 text-green-600" />}
          description="Products currently listed"
        />
        <AnalyticsCard
          title="Customer Satisfaction"
          value="4.8"
          icon={<Star className="w-5 h-5 text-yellow-500" />}
          description="Average customer rating"
        />
      </div>
    </div>
  )
}