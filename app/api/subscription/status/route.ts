import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's current subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subError && subError.code !== 'PGRST116') {
      console.error('Error fetching subscription:', subError)
      return NextResponse.json(
        { error: 'Failed to fetch subscription' },
        { status: 500 }
      )
    }

    // Get user's current usage
    const { data: usage, error: usageError } = await supabase
      .rpc('get_or_create_user_usage', { user_uuid: user.id })

    if (usageError) {
      console.error('Error fetching usage:', usageError)
      return NextResponse.json(
        { error: 'Failed to fetch usage' },
        { status: 500 }
      )
    }

    const currentPlan = subscription?.plan_id || 'free'
    const isActive = subscription?.status === 'active'

    return NextResponse.json({
      plan: currentPlan,
      status: subscription?.status || 'inactive',
      isActive,
      currentPeriodEnd: subscription?.current_period_end,
      usage: {
        used: usage?.[0]?.generations_used || 0,
        limit: usage?.[0]?.generations_limit || 5,
      },
    })
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
