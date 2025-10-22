"use client"

import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import { Pause, Play, Map } from "lucide-react"
import { Minimap } from "./minimap"
import { useState } from "react"

export function HUD() {
  const speed = useGameStore((state) => state.speed)
  const isPaused = useGameStore((state) => state.isPaused)
  const setPaused = useGameStore((state) => state.setPaused)
  const currentZone = useGameStore((state) => state.currentZone)
  const lowGraphics = useGameStore((state) => state.lowGraphics)
  const toggleLowGraphics = useGameStore((state) => state.toggleLowGraphics)
  const cameraMode = useGameStore((state) => state.cameraMode)
  const [showMinimap, setShowMinimap] = useState(true)

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Top bar */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-auto">
        <div className="flex gap-2">
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30">
            <p className="text-sm text-gray-400">Current Zone</p>
            <p className="text-lg font-bold text-purple-300">{currentZone ? currentZone.toUpperCase() : "START"}</p>
          </div>

          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-purple-500/30">
            <p className="text-sm text-gray-400">Camera</p>
            <p className="text-lg font-bold text-cyan-300">{cameraMode.toUpperCase()}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            className="bg-black/60 backdrop-blur-sm border-purple-500/30"
            onClick={() => setPaused(!isPaused)}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>

          <Button
            size="icon"
            variant="outline"
            className="bg-black/60 backdrop-blur-sm border-purple-500/30"
            onClick={() => setShowMinimap(!showMinimap)}
          >
            <Map className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="bg-black/60 backdrop-blur-sm border-purple-500/30"
            onClick={toggleLowGraphics}
          >
            {lowGraphics ? "High Graphics" : "Low Graphics"}
          </Button>
        </div>
      </div>

      {/* Minimap */}
      {showMinimap && <Minimap />}

      {/* Speedometer */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-sm px-6 py-4 rounded-lg border border-purple-500/30">
          <p className="text-sm text-gray-400 mb-1">Speed</p>
          <p className="text-4xl font-bold gradient-text">{Math.round(speed)}</p>
          <p className="text-xs text-gray-500">km/h</p>
        </div>
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-sm px-4 py-3 rounded-lg border border-purple-500/30 pointer-events-auto">
        <p className="text-xs text-gray-400 mb-2">Controls</p>
        <div className="text-xs text-gray-300 space-y-1">
          <p>
            <span className="text-purple-400">WASD / Arrows</span> - Drive
          </p>
          <p>
            <span className="text-purple-400">Space</span> - Brake
          </p>
          <p>
            <span className="text-purple-400">R</span> - Respawn
          </p>
          <p>
            <span className="text-purple-400">C</span> - Camera Mode
          </p>
          <p>
            <span className="text-purple-400">M</span> - Toggle Map
          </p>
          {cameraMode === "free" && (
            <p className="text-cyan-400 mt-2">
              <span className="text-purple-400">Right Click + Drag</span> - Look
            </p>
          )}
        </div>
      </div>

      {/* Pause overlay */}
      {isPaused && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto">
          <div className="text-center">
            <h2 className="text-6xl font-bold gradient-text mb-4">PAUSED</h2>
            <p className="text-gray-400 mb-8">Press ESC or click the pause button to resume</p>
            <Button onClick={() => setPaused(false)} size="lg" className="bg-purple-600 hover:bg-purple-700">
              Resume Game
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
