'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Crown, Zap, Rocket } from 'lucide-react'
import Link from 'next/link'

interface SubscriptionData {
  plan: string
  status: string
  isActive: boolean
  currentPeriodEnd?: string
  usage: {
    used: number
    limit: number
  }
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/subscription/status')
      if (response.ok) {
        const data = await response.json()
        setSubscription(data)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return
    }

    setCancelling(true)
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        alert('Your subscription has been cancelled successfully.')
        fetchSubscriptionStatus() // Refresh the status
      } else {
        alert('Failed to cancel subscription. Please contact support.')
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      alert('Failed to cancel subscription. Please contact support.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return null
  }

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Crown className="h-5 w-5" />
      case 'enterprise':
        return <Rocket className="h-5 w-5" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'bg-yellow-500'
      case 'enterprise':
        return 'bg-purple-500'
      default:
        return 'bg-blue-500'
    }
  }

  const usagePercentage = (subscription.usage.used / subscription.usage.limit) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full ${getPlanColor(subscription.plan)} text-white`}>
              {getPlanIcon(subscription.plan)}
            </div>
            <div>
              <CardTitle className="capitalize">{subscription.plan} Plan</CardTitle>
              <CardDescription>
                {subscription.isActive ? 'Active' : 'Inactive'}
              </CardDescription>
            </div>
          </div>
          <Badge variant={subscription.isActive ? 'default' : 'secondary'}>
            {subscription.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Monthly Usage</span>
            <span>
              {subscription.usage.used} / {subscription.usage.limit === 999999 ? '∞' : subscription.usage.limit}
            </span>
          </div>
          <Progress 
            value={subscription.usage.limit === 999999 ? 0 : usagePercentage} 
            className="h-2"
          />
          {usagePercentage > 80 && subscription.usage.limit !== 999999 && (
            <p className="text-sm text-orange-600">
              You're approaching your monthly limit
            </p>
          )}
        </div>

        {/* Period End */}
        {subscription.currentPeriodEnd && (
          <div className="text-sm text-muted-foreground">
            Current period ends: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          {subscription.plan === 'free' && (
            <Button asChild className="flex-1">
              <Link href="/pricing">Upgrade Plan</Link>
            </Button>
          )}
          {subscription.isActive && subscription.plan !== 'free' && (
            <>
              <Button variant="outline" className="flex-1" asChild>
                <Link href="https://creem.io/customer-portal" target="_blank" rel="noopener noreferrer">
                  Manage Subscription
                </Link>
              </Button>
              <Button variant="destructive" className="flex-1" onClick={handleCancelSubscription} disabled={cancelling}>
                {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
