import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>
            Sorry, we couldn't sign you in. There was an error with the authentication process.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            This could be due to:
            <ul className="mt-2 list-disc list-inside text-left space-y-1">
              <li>Invalid or expired authentication code</li>
              <li>Network connectivity issues</li>
              <li>Server configuration problems</li>
            </ul>
          </div>
          
          <Button asChild className="w-full" size="lg">
            <Link href="/login">
              Try Again
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
