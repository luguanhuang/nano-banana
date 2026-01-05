'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Check, Zap, Crown, Rocket, Star, Sparkles, X, Flame } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

interface PricingPlan {
  id: string
  name: string
  description: string
  monthlyPrice: number
  yearlyPrice: number
  originalMonthlyPrice?: number
  originalYearlyPrice?: number
  credits: {
    monthly: number
    yearly: number
  }
  images: {
    monthly: number
    yearly: number
  }
  popular?: boolean
  features: string[]
  creemPriceId: {
    monthly: string
    yearly: string
  }
}

const currencies = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
]

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals and light users',
    monthlyPrice: 12,
    yearlyPrice: 144,
    originalYearlyPrice: 180,
    credits: {
      monthly: 200,
      yearly: 2400
    },
    images: {
      monthly: 100,
      yearly: 1200
    },
    features: [
      '100 high-quality images/month',
      'All style templates included',
      'Standard generation speed',
      'Basic customer support',
      'JPG/PNG format downloads',
      'Commercial Use License'
    ],
    creemPriceId: {
      monthly: 'price_basic_monthly',
      yearly: 'price_basic_yearly'
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professional creators and teams',
    monthlyPrice: 19.5,
    yearlyPrice: 234,
    originalMonthlyPrice: 39,
    originalYearlyPrice: 468,
    credits: {
      monthly: 800,
      yearly: 9600
    },
    images: {
      monthly: 400,
      yearly: 4800
    },
    popular: true,
    features: [
      '400 high-quality images/month',
      'Support Seedream-4 Model',
      'Support Nanobanana-Pro Model',
      'All style templates included',
      'Priority generation queue',
      'Priority customer support',
      'JPG/PNG/WebP format downloads',
      'Batch generation feature',
      'Image editing tools (Coming in October)',
      'Commercial Use License'
    ],
    creemPriceId: {
      monthly: 'price_pro_monthly',
      yearly: 'price_pro_yearly'
    }
  },
  {
    id: 'max',
    name: 'Max',
    description: 'Designed for large enterprises and professional studios',
    monthlyPrice: 80,
    yearlyPrice: 960,
    originalMonthlyPrice: 160,
    originalYearlyPrice: 1920,
    credits: {
      monthly: 3600,
      yearly: 43200
    },
    images: {
      monthly: 1800,
      yearly: 21600
    },
    features: [
      '1800 high-quality images/month',
      'Support Seedream-4 Model',
      'Support Nanobanana-Pro Model',
      'All style templates included',
      'Fastest generation speed',
      'Dedicated account manager',
      'All format downloads',
      'Batch generation feature',
      'Professional editing suite (Coming in October)',
      'Commercial Use License'
    ],
    creemPriceId: {
      monthly: 'price_max_monthly',
      yearly: 'price_max_yearly'
    }
  }
]

export default function PricingPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [isYearly, setIsYearly] = useState(true)
  const [selectedCurrency, setSelectedCurrency] = useState('USD')

  const handleSubscribe = async (plan: PricingPlan) => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    setIsLoading(plan.id)
    
    try {
      const priceId = isYearly ? plan.creemPriceId.yearly : plan.creemPriceId.monthly
      
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: priceId,
          planId: plan.id,
          billingPeriod: isYearly ? 'yearly' : 'monthly',
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const getCurrentPrice = (plan: PricingPlan) => {
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice
  }

  const getOriginalPrice = (plan: PricingPlan) => {
    return isYearly ? plan.originalYearlyPrice : plan.originalMonthlyPrice
  }

  const getCredits = (plan: PricingPlan) => {
    return isYearly ? plan.credits.yearly : plan.credits.monthly
  }

  const getImages = (plan: PricingPlan) => {
    return isYearly ? plan.images.yearly : plan.images.monthly
  }

  const getSavingsPercentage = (plan: PricingPlan) => {
    if (!isYearly || !plan.originalYearlyPrice) return 0
    return Math.round(((plan.originalYearlyPrice - plan.yearlyPrice) / plan.originalYearlyPrice) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Limited Time Banner */}
        <div className="text-center mb-8">
          <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 px-4 py-2">
            <Flame className="h-4 w-4 mr-2" />
            🍌 Limited Time: Save 50% with Annual Billing
          </Badge>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Unlimited creativity starts here
          </p>

          {/* Currency Selector */}
          <div className="flex justify-center mb-8">
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-orange-500"
            />
            <span className={`text-sm ${isYearly ? 'font-semibold' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 ml-2">
                🔥 LIMITED TIME: Save 50%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => {
            const currentPrice = getCurrentPrice(plan)
            const originalPrice = getOriginalPrice(plan)
            const credits = getCredits(plan)
            const images = getImages(plan)
            const savings = getSavingsPercentage(plan)
            const currency = currencies.find(c => c.code === selectedCurrency)

            return (
              <Card 
                key={plan.id} 
                className={`relative ${
                  plan.popular 
                    ? 'border-orange-500 shadow-lg scale-105 ring-2 ring-orange-200' 
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 hover:bg-orange-600">
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  
                  <div className="mt-6">
                    <div className="flex items-center justify-center gap-2">
                      {originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {currency?.symbol}{originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-4xl font-bold">
                        {currency?.symbol}{currentPrice.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">
                        /{isYearly ? 'year' : 'mo'}
                      </span>
                    </div>
                    
                    {isYearly && savings > 0 && (
                      <Badge variant="secondary" className="mt-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        ⚡ SAVE {savings}%
                      </Badge>
                    )}
                    
                    <div className="mt-4 text-sm text-muted-foreground">
                      {credits.toLocaleString()} credits/{isYearly ? 'year' : 'month'}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Key Stats */}
                  <div className="bg-muted/50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{images.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">
                      high-quality images/{isYearly ? 'year' : 'month'}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading === plan.id}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-orange-500 hover:bg-orange-600 text-white' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {isLoading === plan.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Processing...
                      </div>
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What are credits and how do they work?</h3>
                <p className="text-muted-foreground text-sm">
                  2 credits generate 1 high-quality image. Credits are automatically refilled at the start of each billing cycle - monthly for monthly plans, all at once for yearly plans.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
                <p className="text-muted-foreground text-sm">
                  Yes, you can upgrade or downgrade your plan at any time. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Do unused credits roll over?</h3>
                <p className="text-muted-foreground text-sm">
                  Monthly plan credits do not roll over to the next month. Yearly plan credits are valid for the entire subscription period. We recommend choosing a plan based on your actual usage needs.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">What payment methods are supported?</h3>
                <p className="text-muted-foreground text-sm">
                  We support credit cards, debit cards, Alipay, WeChat Pay, and various other payment methods. All payments are processed through secure third-party payment platforms.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Can I use images commercially?</h3>
                <p className="text-muted-foreground text-sm">
                  All plans include commercial usage rights. You can use generated images for personal and commercial projects without restrictions.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Have more questions?</h3>
                <p className="text-muted-foreground text-sm">
                  We're here to help! Contact our support team for any additional questions or custom enterprise solutions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>imgeditor.co is an independent product and is not affiliate with Google or any of its brands</p>
        </div>
      </div>
    </div>
  )
}
