'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome } from 'lucide-react'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No URL returned from login endpoint')
      }
    } catch (error) {
      console.error('Error during login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Nano Banana</CardTitle>
          <CardDescription>
            Sign in with your Google account to get started with AI image generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            <Chrome className="mr-2 h-4 w-4" />
            {isLoading ? 'Signing in...' : 'Continue with Google'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            By signing in, you agree to our <a href="/terms-of-service" className="underline hover:text-foreground">Terms of Service</a> and <a href="/privacy-policy" className="underline hover:text-foreground">Privacy Policy</a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
