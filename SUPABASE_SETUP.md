# Supabase Google Authentication Setup

This guide will help you set up Google authentication with Supabase for your Nano Banana application.

## Prerequisites

1. A Supabase account (https://supabase.com)
2. A Google Cloud Console account (https://console.cloud.google.com)

## Step 1: Create a Supabase Project

1. Go to https://supabase.com and sign in
2. Click "New Project"
3. Fill in your project details:
   - Name: `nano-banana` (or your preferred name)
   - Database Password: Generate a secure password
   - Region: Choose the closest region to your users
4. Click "Create new project"

## Step 2: Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Configure Google OAuth

### 3.1 Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth 2.0 Client IDs**
   - Choose **Web application**
   - Add authorized redirect URIs:
     - For development: `https://your-project-ref.supabase.co/auth/v1/callback`
     - For production: `https://your-domain.com/auth/callback`

### 3.2 Configure Supabase Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click **Enable**
3. Enter your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console
4. Click **Save**

## Step 4: Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 5: Configure Site URL

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set your Site URL:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`
3. Add redirect URLs:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`

## Step 6: Test the Integration

1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign In" in the header
4. Try logging in with Google

## Deployment Considerations

### Vercel Deployment

1. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add the same environment variables from `.env.local`
2. Update redirect URLs in both Google Cloud Console and Supabase to use your production domain

### Domain Configuration

Make sure to update the following with your production domain:
- Google Cloud Console authorized redirect URIs
- Supabase Site URL and redirect URLs
- Environment variables in your deployment platform

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**: Make sure the redirect URI in Google Cloud Console matches exactly with your Supabase callback URL
2. **"Site URL not allowed"**: Check that your site URL is correctly configured in Supabase Authentication settings
3. **"Invalid client"**: Verify that your Google OAuth credentials are correctly entered in Supabase

### Debug Mode

To enable debug mode, add this to your environment variables:
```env
NEXT_PUBLIC_SUPABASE_DEBUG=true
```

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service role key secret and only use it on the server side
- Regularly rotate your API keys
- Use environment-specific configurations for development and production

## Support

If you encounter issues:
1. Check the Supabase documentation: https://supabase.com/docs/guides/auth/social-login/auth-google
2. Review the Google OAuth documentation: https://developers.google.com/identity/protocols/oauth2
3. Check the browser console and server logs for error messages
