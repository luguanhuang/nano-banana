import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <section className="pt-32 pb-16 px-4">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm mb-8 border border-accent">
          <span className="text-lg">🍌</span>
          <span className="font-medium">The AI model that outperforms Flux Kontext</span>
          <Link href="#generator" className="text-foreground font-semibold hover:underline">
            Try Now →
          </Link>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">Nano Banana</h1>

        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
          Transform any image with simple text prompts. Nano-banana's advanced model delivers consistent character
          editing and scene preservation that surpasses Flux Kontext. Experience the future of AI image editing.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="text-lg h-12 px-8">
            Start Editing
          </Button>
          <Button size="lg" variant="outline" className="text-lg h-12 px-8 bg-transparent" asChild>
            <Link href="#showcase">View Examples</Link>
          </Button>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">✓</span>
            <span>One-shot editing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">✓</span>
            <span>Multi-image support</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent text-lg">✓</span>
            <span>Natural language</span>
          </div>
        </div>
      </div>
    </section>
  )
}
