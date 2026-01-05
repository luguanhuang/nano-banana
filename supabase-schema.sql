-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id VARCHAR(50) NOT NULL,
  creem_customer_id VARCHAR(255),
  creem_subscription_id VARCHAR(255) UNIQUE,
  status VARCHAR(50) NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_logs table
CREATE TABLE IF NOT EXISTS payment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  creem_payment_id VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL DEFAULT 'USD',
  status VARCHAR(50) NOT NULL,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_usage table to track API usage
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  generations_used INTEGER NOT NULL DEFAULT 0,
  generations_limit INTEGER NOT NULL DEFAULT 5, -- Default free tier limit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_creem_subscription_id ON user_subscriptions(creem_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_logs_creem_payment_id ON payment_logs(creem_payment_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_user_id ON user_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_usage_month_year ON user_usage(month_year);

-- Create RLS (Row Level Security) policies
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscription data
CREATE POLICY "Users can view own subscriptions" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all data (for webhooks and admin operations)
CREATE POLICY "Service role can manage subscriptions" ON user_subscriptions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage usage" ON user_usage
  FOR ALL USING (auth.role() = 'service_role');

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_subscription(user_uuid UUID)
RETURNS TABLE (
  plan_id VARCHAR(50),
  status VARCHAR(50),
  current_period_end TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.plan_id,
    us.status,
    us.current_period_end
  FROM user_subscriptions us
  WHERE us.user_id = user_uuid
    AND us.status IN ('active', 'trialing')
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get or create user usage for current month
CREATE OR REPLACE FUNCTION get_or_create_user_usage(user_uuid UUID)
RETURNS TABLE (
  generations_used INTEGER,
  generations_limit INTEGER
) AS $$
DECLARE
  current_month VARCHAR(7);
  usage_record RECORD;
  user_plan RECORD;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Get user's current plan
  SELECT * INTO user_plan FROM get_user_subscription(user_uuid);
  
  -- Set generation limit based on plan
  DECLARE
    gen_limit INTEGER := 5; -- Default free tier
  BEGIN
    IF user_plan.plan_id = 'pro' THEN
      gen_limit := 500;
    ELSIF user_plan.plan_id = 'enterprise' THEN
      gen_limit := 999999; -- Unlimited (high number)
    END IF;
    
    -- Get or create usage record
    INSERT INTO user_usage (user_id, month_year, generations_used, generations_limit)
    VALUES (user_uuid, current_month, 0, gen_limit)
    ON CONFLICT (user_id, month_year)
    DO UPDATE SET 
      generations_limit = gen_limit,
      updated_at = NOW()
    RETURNING * INTO usage_record;
    
    RETURN QUERY SELECT usage_record.generations_used, usage_record.generations_limit;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment user usage
CREATE OR REPLACE FUNCTION increment_user_usage(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_month VARCHAR(7);
  current_usage RECORD;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Get current usage
  SELECT * INTO current_usage FROM get_or_create_user_usage(user_uuid);
  
  -- Check if user has remaining generations
  IF current_usage.generations_used >= current_usage.generations_limit THEN
    RETURN FALSE; -- Usage limit exceeded
  END IF;
  
  -- Increment usage
  UPDATE user_usage 
  SET 
    generations_used = generations_used + 1,
    updated_at = NOW()
  WHERE user_id = user_uuid AND month_year = current_month;
  
  RETURN TRUE; -- Success
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
