import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user can use the service (increment usage)
    const { data: canUse, error: usageError } = await supabase
      .rpc('increment_user_usage', { user_uuid: user.id })

    if (usageError) {
      console.error('Error checking usage:', usageError)
      return NextResponse.json(
        { error: 'Failed to check usage' },
        { status: 500 }
      )
    }

    if (!canUse) {
      return NextResponse.json(
        { 
          error: 'Usage limit exceeded',
          message: 'You have reached your monthly generation limit. Please upgrade your plan to continue.'
        },
        { status: 429 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error checking usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
