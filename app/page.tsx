import { Hero } from "@/components/hero"
import { Generator } from "@/components/generator"
import { Features } from "@/components/features"
import { Showcase } from "@/components/showcase"
import { Reviews } from "@/components/reviews"
import { FAQ } from "@/components/faq"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Generator />
      <Features />
      <Showcase />
      <Reviews />
      <FAQ />
    </div>
  )
}
