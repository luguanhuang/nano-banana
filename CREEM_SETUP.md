# Creem Payment Integration Setup

This guide will help you set up Creem payment integration for your Nano Banana application.

## Prerequisites

1. A Creem account (https://creem.io)
2. Supabase project with authentication set up
3. Your application deployed (for webhook URLs)

## Step 1: Create a Creem Account

1. Go to https://creem.io and sign up
2. Complete the onboarding process
3. Verify your business details

## Step 2: Get Creem API Credentials

1. In your Creem dashboard, go to **Developers** → **API Keys**
2. Copy your **Live API Key** (or Test API Key for development)
3. Generate a **Webhook Secret** for secure webhook verification

## Step 3: Create Products and Prices

### 3.1 Create Products

In your Creem dashboard:

1. Go to **Products** → **Create Product**
2. Create the following products:

**Pro Plan:**
- Name: `Nano Banana Pro`
- Description: `Professional AI image editing with 500 generations per month`

**Enterprise Plan:**
- Name: `Nano Banana Enterprise`
- Description: `Enterprise AI image editing with unlimited generations`

### 3.2 Create Prices

For each product, create monthly recurring prices:

**Pro Plan Price:**
- Amount: `$19.00`
- Currency: `USD`
- Billing Period: `Monthly`
- Copy the **Price ID** (e.g., `price_pro_monthly`)

**Enterprise Plan Price:**
- Amount: `$99.00`
- Currency: `USD`
- Billing Period: `Monthly`
- Copy the **Price ID** (e.g., `price_enterprise_monthly`)

## Step 4: Update Environment Variables

Update your `.env.local` file:

```env
# Creem Payment Configuration
CREEM_API_KEY=your_live_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

For development:
```env
CREEM_API_KEY=your_test_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Step 5: Update Pricing Configuration

In `app/pricing/page.tsx`, update the `creemPriceId` values:

```typescript
const pricingPlans: PricingPlan[] = [
  // ... free plan
  {
    id: 'pro',
    // ... other properties
    creemPriceId: 'price_1234567890', // Your actual Pro price ID
  },
  {
    id: 'enterprise',
    // ... other properties
    creemPriceId: 'price_0987654321', // Your actual Enterprise price ID
  }
]
```

## Step 6: Set Up Database Tables

Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to create the tables and functions

## Step 7: Configure Webhooks

### 7.1 Set Webhook URL

In your Creem dashboard:

1. Go to **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. Set the URL to: `https://your-domain.com/api/webhooks/creem`
4. Select the following events:
   - `checkout.session.completed`
   - `subscription.created`
   - `subscription.updated`
   - `subscription.cancelled`
   - `payment.succeeded`
   - `payment.failed`

### 7.2 Test Webhook

Use Creem's webhook testing tool to ensure your endpoint is working correctly.

## Step 8: Test the Integration

### 8.1 Test Mode

1. Use Creem's test API keys
2. Create test products and prices
3. Test the complete flow:
   - Visit `/pricing`
   - Click "Subscribe Now" on a paid plan
   - Complete the checkout process
   - Verify webhook reception
   - Check database updates

### 8.2 Test Cards

Use Creem's test card numbers:
- **Success**: `4242424242424242`
- **Decline**: `4000000000000002`

## Step 9: Go Live

### 9.1 Switch to Live Mode

1. Replace test API keys with live keys
2. Update webhook URLs to production domain
3. Create live products and prices
4. Update price IDs in your code

### 9.2 Verify Live Integration

1. Test with real payment methods (small amounts)
2. Monitor webhook delivery
3. Verify database updates
4. Test subscription management

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code
2. **Webhook Verification**: Always verify webhook signatures
3. **HTTPS**: Use HTTPS for all webhook endpoints
4. **Environment Variables**: Keep sensitive data in environment variables
5. **Database Security**: Use RLS (Row Level Security) in Supabase

## Monitoring and Maintenance

### 9.1 Monitor Webhooks

- Set up alerts for failed webhook deliveries
- Monitor payment success/failure rates
- Track subscription metrics

### 9.2 Handle Edge Cases

- Failed payments
- Subscription cancellations
- Refunds and disputes
- Account downgrades

## Troubleshooting

### Common Issues

1. **Webhook Not Received**
   - Check webhook URL is correct and accessible
   - Verify webhook secret matches
   - Check firewall settings

2. **Payment Fails**
   - Verify price IDs are correct
   - Check API key permissions
   - Review Creem dashboard for errors

3. **Database Not Updated**
   - Check webhook signature verification
   - Review server logs for errors
   - Verify database permissions

### Debug Mode

Enable debug logging by adding to your environment:
```env
CREEM_DEBUG=true
```

## Support

- **Creem Documentation**: https://docs.creem.io
- **Creem Support**: Available in your dashboard
- **API Reference**: https://docs.creem.io/api-reference

## Testing Checklist

- [ ] Products and prices created in Creem
- [ ] Environment variables configured
- [ ] Database tables created
- [ ] Webhook endpoint configured
- [ ] Test payment flow works
- [ ] Webhook events are processed
- [ ] Database updates correctly
- [ ] Usage limits enforced
- [ ] Subscription status displayed correctly
