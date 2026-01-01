"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Sparkles } from "lucide-react"

export function Generator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [output, setOutput] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!imagePreview || !prompt) return

    setIsGenerating(true)
    setOutput(null)

    try {
      const response = await fetch("/api/process-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          image: imagePreview,
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setOutput(data.result)
      } else {
        console.error("Error:", data.error)
      }
    } catch (error) {
      console.error("Failed to generate:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section id="generator" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Get Started</h2>
          <p className="text-xl text-muted-foreground text-pretty">Try The AI Editor</p>
          <p className="text-muted-foreground mt-2">
            Experience the power of nano-banana's natural language image editing. Transform any photo with simple text
            commands
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Prompt Engine
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Transform your image with AI-powered editing</p>

            <div className="space-y-6">
              <div>
                <Label htmlFor="image-upload" className="text-sm font-medium mb-2 block">
                  Reference Image
                </Label>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-40 mx-auto rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Add Image</p>
                        <p className="text-xs text-muted-foreground mt-1">Max 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="prompt" className="text-sm font-medium mb-2 block">
                  Main Prompt
                </Label>
                <Input
                  id="prompt"
                  placeholder="Describe your desired edits..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-20"
                />
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !imagePreview || !prompt}
              >
                {isGenerating ? "Generating..." : "Generate Now"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-card">
            <h3 className="text-xl font-semibold mb-6">Output Gallery</h3>
            <p className="text-sm text-muted-foreground mb-6">Your ultra-fast AI creations appear here instantly</p>

            <div className="border-2 border-dashed border-border rounded-lg p-12 text-center min-h-[300px] flex flex-col items-center justify-center overflow-hidden">
              {output ? (
                <div className="w-full h-full flex items-center justify-center">
                  {/* Check if output is a direct URL or contains a markdown image/URL */}
                  {(() => {
                    // Match http/https URLs, excluding common trailing punctuation often found in markdown
                    const urlRegex = /(https?:\/\/[^\s\)]+)/g
                    const match = output.match(urlRegex)
                    const imageUrl = output.startsWith("data:image") ? output : (match ? match[0] : null)
                    
                    if (imageUrl) {
                        return <img src={imageUrl} alt="Generated Output" className="max-w-full max-h-full rounded-lg" />
                    } else {
                        return (
                            <div className="text-left w-full p-4 bg-muted rounded-lg whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[300px]">
                              {output}
                            </div>
                        )
                    }
                  })()}
                </div>
              ) : (
                <>
                  <span className="text-6xl mb-4">🍌</span>
                  <p className="text-muted-foreground font-medium">Ready for instant generation</p>
                  <p className="text-sm text-muted-foreground mt-2">Enter your prompt and unleash the power</p>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
