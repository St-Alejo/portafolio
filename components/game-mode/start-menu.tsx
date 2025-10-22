"use client"

import { Button } from "@/components/ui/button"
import { Play, Info } from "lucide-react"
import { useState } from "react"

interface StartMenuProps {
  onStart: () => void
}

export function StartMenu({ onStart }: StartMenuProps) {
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-purple-950/20 to-black">
      <div className="absolute inset-0 bg-[url('/abstract-racing-track-neon.jpg')] opacity-10 bg-cover bg-center"></div>

      <div className="relative text-center max-w-2xl mx-4">
        <div className="mb-8">
          <h1 className="text-6xl md:text-7xl font-bold mb-4 gradient-text animate-in fade-in slide-in-from-bottom-4 duration-700">
            Portfolio Race
          </h1>
          <p className="text-xl text-gray-300 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Drive through Steven Ortega's portfolio
          </p>
        </div>

        {!showInstructions ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Button
              size="lg"
              className="w-full max-w-xs bg-purple-600 hover:bg-purple-700 text-lg py-6 gap-2 neon-glow-purple"
              onClick={onStart}
            >
              <Play className="w-5 h-5" />
              Start Race
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full max-w-xs border-purple-500 text-purple-300 hover:bg-purple-500/20 text-lg py-6 gap-2 bg-transparent"
              onClick={() => setShowInstructions(true)}
            >
              <Info className="w-5 h-5" />
              How to Play
            </Button>

            <div className="mt-8 pt-8 border-t border-purple-500/30">
              <p className="text-sm text-gray-400">
                Experience the portfolio in a unique way - race through different sections and discover projects,
                skills, and achievements
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-black/60 backdrop-blur-sm p-8 rounded-lg border border-purple-500/30 animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-bold gradient-text mb-6">How to Play</h2>

            <div className="text-left space-y-4 text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Controls</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <kbd className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">W / ↑</kbd> - Accelerate
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">S / ↓</kbd> - Brake / Reverse
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">A / ←</kbd> - Steer Left
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">D / →</kbd> - Steer Right
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">Space</kbd> - Handbrake
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">R</kbd> - Respawn
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">C</kbd> - Change Camera
                  </li>
                  <li>
                    <kbd className="px-2 py-1 bg-purple-900/50 rounded text-purple-300">M</kbd> - Toggle Minimap
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Objective</h3>
                <p className="text-sm">
                  Drive through each zone to discover different sections of the portfolio. Each checkpoint reveals
                  information about projects, skills, experience, and more.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-purple-300 mb-2">Mobile Controls</h3>
                <p className="text-sm">
                  On mobile devices, use the on-screen joystick to steer and the buttons to accelerate and brake.
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={onStart}>
                Start Race
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-purple-500 bg-transparent"
                onClick={() => setShowInstructions(false)}
              >
                Back
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
