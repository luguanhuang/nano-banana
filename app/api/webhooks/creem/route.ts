import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CreemClient } from '@/lib/creem'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('creem-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const isValid = CreemClient.verifyWebhookSignature(
      body,
      signature,
      process.env.CREEM_WEBHOOK_SECRET!
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)

    // Handle different webhook events
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data)
        break
      
      case 'subscription.created':
        await handleSubscriptionCreated(event.data)
        break
      
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data)
        break
      
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data)
        break
      
      case 'payment.succeeded':
        await handlePaymentSucceeded(event.data)
        break
      
      case 'payment.failed':
        await handlePaymentFailed(event.data)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(data: any) {
  const supabase = await createClient()
  
  try {
    const { userId, planId } = data.metadata
    
    // Update user's subscription in database
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        plan_id: planId,
        creem_customer_id: data.customer_id,
        creem_subscription_id: data.subscription_id,
        status: 'active',
        current_period_start: new Date(data.current_period_start * 1000),
        current_period_end: new Date(data.current_period_end * 1000),
        updated_at: new Date(),
      })

    if (error) {
      console.error('Error updating subscription:', error)
    }
  } catch (error) {
    console.error('Error handling checkout completed:', error)
  }
}

async function handleSubscriptionCreated(data: any) {
  const supabase = await createClient()
  
  try {
    const { userId } = data.metadata
    
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        creem_subscription_id: data.id,
        status: data.status,
        current_period_start: new Date(data.current_period_start * 1000),
        current_period_end: new Date(data.current_period_end * 1000),
        updated_at: new Date(),
      })

    if (error) {
      console.error('Error creating subscription:', error)
    }
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(data: any) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: data.status,
        current_period_start: new Date(data.current_period_start * 1000),
        current_period_end: new Date(data.current_period_end * 1000),
        updated_at: new Date(),
      })
      .eq('creem_subscription_id', data.id)

    if (error) {
      console.error('Error updating subscription:', error)
    }
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionCancelled(data: any) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date(),
        updated_at: new Date(),
      })
      .eq('creem_subscription_id', data.id)

    if (error) {
      console.error('Error cancelling subscription:', error)
    }
  } catch (error) {
    console.error('Error handling subscription cancelled:', error)
  }
}

async function handlePaymentSucceeded(data: any) {
  const supabase = await createClient()
  
  try {
    // Log successful payment
    const { error } = await supabase
      .from('payment_logs')
      .insert({
        creem_payment_id: data.id,
        amount: data.amount,
        currency: data.currency,
        status: 'succeeded',
        created_at: new Date(),
      })

    if (error) {
      console.error('Error logging payment:', error)
    }
  } catch (error) {
    console.error('Error handling payment succeeded:', error)
  }
}

async function handlePaymentFailed(data: any) {
  const supabase = await createClient()
  
  try {
    // Log failed payment
    const { error } = await supabase
      .from('payment_logs')
      .insert({
        creem_payment_id: data.id,
        amount: data.amount,
        currency: data.currency,
        status: 'failed',
        failure_reason: data.failure_reason,
        created_at: new Date(),
      })

    if (error) {
      console.error('Error logging failed payment:', error)
    }
  } catch (error) {
    console.error('Error handling payment failed:', error)
  }
}
