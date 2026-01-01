import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"

const reviews = [
  {
    name: "AIArtistPro",
    role: "Digital Creator",
    content:
      "This editor completely changed my workflow. The character consistency is incredible - miles ahead of Flux Kontext!",
    avatar: "👨‍🎨",
  },
  {
    name: "ContentCreator",
    role: "UGC Specialist",
    content:
      "Creating consistent AI influencers has never been easier. It maintains perfect face details across edits!",
    avatar: "👩‍💼",
  },
  {
    name: "PhotoEditor",
    role: "Professional Editor",
    content: "One-shot editing is basically solved with this tool. The scene blending is so natural and realistic!",
    avatar: "📸",
  },
]

export function Reviews() {
  return (
    <section id="reviews" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">User Reviews</h2>
          <p className="text-xl text-muted-foreground">What creators are saying</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 text-pretty">"{review.content}"</p>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{review.avatar}</div>
                <div>
                  <p className="font-semibold text-sm">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
