import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <span className="text-2xl">🍌</span>
              <span className="text-balance">Nano Banana</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Transform any image with simple text prompts. Nano Banana is an independent platform built to enhance your creative workflow.
            </p>
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-1">Contact Support:</p>
              <a href="mailto:nanobanana@lghuang.xyz" className="hover:text-primary transition-colors">
                nanobanana@lghuang.xyz
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#generator" className="hover:text-foreground">Generator</Link></li>
              <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
              <li><Link href="/#showcase" className="hover:text-foreground">Showcase</Link></li>
              <li><Link href="/#faq" className="hover:text-foreground">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Nano Banana. All rights reserved.</p>
          <div className="text-center md:text-right">
             <p className="mb-1">Nano Banana is an independent product and is not affiliated with any AI model providers.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

