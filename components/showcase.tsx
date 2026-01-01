import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const examples = [
  {
    title: "Ultra-Fast Mountain Generation",
    description: "Created in 0.8 seconds with Nano Banana's optimized neural engine",
    image: "/sunset-mountain-landscape.png",
  },
  {
    title: "Instant Garden Creation",
    description: "Complex scene rendered in milliseconds using Nano Banana technology",
    image: "/beautiful-garden-with-flowers.jpg",
  },
  {
    title: "Real-time Beach Synthesis",
    description: "Nano Banana delivers photorealistic results at lightning speed",
    image: "/tropical-beach-palms.png",
  },
  {
    title: "Rapid Aurora Generation",
    description: "Advanced effects processed instantly with Nano Banana AI",
    image: "/images/northern-lights.png",
  },
]

export function Showcase() {
  return (
    <section id="showcase" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Showcase</h2>
          <p className="text-xl text-muted-foreground">Lightning-Fast AI Creations</p>
          <p className="text-muted-foreground mt-2">See what Nano Banana generates in milliseconds</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {examples.map((example, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={example.image || "/placeholder.svg"}
                  alt={example.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-accent/90 text-accent-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                  <span>🍌</span>
                  Nano Banana Speed
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">{example.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{example.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-muted-foreground mb-4">Experience the power of Nano Banana yourself</p>
          <Button size="lg" asChild>
            <Link href="#generator">Try Nano Banana Generator</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
