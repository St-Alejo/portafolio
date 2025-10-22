"use client"

import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import { X, ExternalLink } from "lucide-react"
import { useEffect } from "react"

export function UIOverlay() {
  const isOverlayOpen = useGameStore((state) => state.isOverlayOpen)
  const overlayContent = useGameStore((state) => state.overlayContent)
  const setOverlay = useGameStore((state) => state.setOverlay)
  const setPaused = useGameStore((state) => state.setPaused)

  // Pause game when overlay is open
  useEffect(() => {
    if (isOverlayOpen) {
      setPaused(true)
    } else {
      setPaused(false)
    }
  }, [isOverlayOpen, setPaused])

  // Handle ESC key to close overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOverlayOpen) {
        setOverlay(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOverlayOpen, setOverlay])

  if (!isOverlayOpen || !overlayContent) return null

  // Map zone IDs to portfolio section URLs
  const sectionLinks: Record<string, string> = {
    hero: "#hero",
    about: "#about",
    projects: "#projects",
    certificates: "#certificates",
    testimonials: "#testimonials",
    experience: "#experience",
    contact: "#contact",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative max-w-2xl w-full mx-4 p-8 bg-gradient-to-br from-purple-900/95 to-blue-900/95 rounded-lg border-2 border-purple-500/50 neon-glow-purple animate-in zoom-in-95 duration-300">
        <button
          onClick={() => setOverlay(false)}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
          aria-label="Close overlay"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-6">
          <div className="inline-block px-3 py-1 bg-purple-500/30 rounded-full text-sm text-purple-300 mb-3">
            Zone Checkpoint
          </div>
          <h2 className="text-4xl font-bold mb-4 gradient-text text-balance">{overlayContent.title}</h2>
          <p className="text-lg text-gray-200 text-pretty">{overlayContent.description}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            className="bg-purple-600 hover:bg-purple-700 gap-2"
            onClick={() => {
              // TODO: Navigate to actual portfolio section
              const link = sectionLinks[overlayContent.zoneId]
              console.log("[v0] Navigate to section:", link)
              // In a real implementation, this would navigate to the portfolio section
              // For now, just close the overlay
              setOverlay(false)
            }}
          >
            <ExternalLink className="w-4 h-4" />
            View Full Section
          </Button>

          <Button
            variant="outline"
            className="border-purple-500 text-purple-300 hover:bg-purple-500/20 bg-transparent"
            onClick={() => setOverlay(false)}
          >
            Continue Driving
          </Button>

          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white hover:bg-white/10"
            onClick={() => {
              setOverlay(false)
              // Trigger respawn
              window.dispatchEvent(new KeyboardEvent("keydown", { key: "r" }))
            }}
          >
            Restart from Beginning
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-purple-500/30">
          <p className="text-sm text-gray-400">
            Press <kbd className="px-2 py-1 bg-black/40 rounded text-purple-300">ESC</kbd> or{" "}
            <kbd className="px-2 py-1 bg-black/40 rounded text-purple-300">Space</kbd> to continue
          </p>
        </div>
      </div>
    </div>
  )
}
