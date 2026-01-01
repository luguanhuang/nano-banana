import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-2xl">🍌</span>
          <span className="text-balance">Nano Banana</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#generator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Generator
          </Link>
          <Link href="#showcase" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Examples
          </Link>
          <Link href="#reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Reviews
          </Link>
          <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </Link>
        </nav>
        <Button>Start Editing</Button>
      </div>
    </header>
  )
}
