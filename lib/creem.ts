import axios from 'axios'

const CREEM_API_BASE = 'https://test-api.creem.io'

export class CreemClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private getHeaders() {
    return {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json',
    }
  }

  async createCheckoutSession(params: {
    priceId: string
    successUrl: string
    cancelUrl: string
    customerEmail?: string
    metadata?: Record<string, string>
  }) {
    // Mock mode for development - since Creem API endpoint is not working
    const isMockMode = process.env.NODE_ENV === 'development' || process.env.CREEM_MOCK_MODE === 'true'
    
    if (isMockMode) {
      console.log('🚀 Mock Payment Mode - Redirecting to mock checkout page')
      console.log('Mock Request Data:', {
        priceId: params.priceId,
        customerEmail: params.customerEmail,
        metadata: params.metadata
      })
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Generate mock session ID
      const mockSessionId = `mock_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Determine plan from priceId
      const planId = params.priceId.includes('enterprise') ? 'enterprise' : 'pro'
      
      // Return mock checkout page URL instead of success URL
      return {
        id: mockSessionId,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout?plan=${planId}&session_id=${mockSessionId}`,
        status: 'open',
        customer_email: params.customerEmail,
        metadata: params.metadata
      }
    }

    // Real API mode (for production)
    try {
      const requestData = {
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        line_items: [
          {
            price: params.priceId,
            quantity: 1
          }
        ],
        customer_email: params.customerEmail,
        metadata: params.metadata,
      }
      
      console.log('Creem API Request:', {
        url: `${CREEM_API_BASE}/checkout/sessions`,
        headers: this.getHeaders(),
        data: requestData
      })

      const response = await axios.post(
        `${CREEM_API_BASE}/checkout/sessions`,
        requestData,
        {
          headers: this.getHeaders(),
        }
      )

      return response.data
    } catch (error) {
      console.error('Creem API Error:', error)
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status)
        console.error('Response data:', error.response?.data)
        console.error('Request URL:', error.config?.url)
        console.error('Request headers:', error.config?.headers)
      }
      throw error
    }
  }

  async getCustomer(customerId: string) {
    try {
      const response = await axios.get(
        `${CREEM_API_BASE}/customers/${customerId}`,
        {
          headers: this.getHeaders(),
        }
      )

      return response.data
    } catch (error) {
      console.error('Creem API Error:', error)
      throw error
    }
  }

  async getSubscription(subscriptionId: string) {
    try {
      const response = await axios.get(
        `${CREEM_API_BASE}/subscriptions/${subscriptionId}`,
        {
          headers: this.getHeaders(),
        }
      )

      return response.data
    } catch (error) {
      console.error('Creem API Error:', error)
      throw error
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await axios.post(
        `${CREEM_API_BASE}/subscriptions/${subscriptionId}/cancel`,
        {},
        {
          headers: this.getHeaders(),
        }
      )

      return response.data
    } catch (error) {
      console.error('Creem API Error:', error)
      throw error
    }
  }

  // Webhook signature verification
  static verifyWebhookSignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  }
}

// Export singleton instance
export const creem = new CreemClient(process.env.CREEM_API_KEY || '')
