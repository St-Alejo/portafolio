"use client"

import { useGameStore } from "@/lib/game-store"
import { ZONES_CONFIG } from "@/lib/game-config"

export function Minimap() {
  const bikePosition = useGameStore((state) => state.bikePosition)
  const currentZone = useGameStore((state) => state.currentZone)

  // Scale factor for minimap (track coordinates to minimap pixels)
  const scale = 1.5
  const offsetX = 80
  const offsetY = 80

  return (
    <div className="absolute top-4 right-4 w-48 h-48 bg-black/60 backdrop-blur-sm rounded-lg border border-purple-500/30 p-2">
      <p className="text-xs text-gray-400 mb-1">Track Map</p>
      <svg viewBox="0 0 160 160" className="w-full h-full">
        {/* Track outline - simplified */}
        <path
          d="M 10 80 L 50 80 Q 70 80 70 60 L 70 40 L 100 40 Q 110 40 115 50 L 125 70 Q 130 80 120 85 L 100 100 Q 90 110 80 100 L 60 80 L 40 90 L 30 85 Z"
          fill="none"
          stroke="#1a1a2e"
          strokeWidth="12"
        />

        {/* Zone markers */}
        {ZONES_CONFIG.map((zone) => {
          const x = zone.position[0] * scale + offsetX
          const y = zone.position[2] * scale + offsetY
          const isActive = currentZone === zone.id

          return (
            <circle
              key={zone.id}
              cx={x}
              cy={y}
              r={isActive ? 6 : 4}
              fill={zone.color}
              opacity={isActive ? 1 : 0.6}
              stroke={isActive ? "#ffffff" : "none"}
              strokeWidth={isActive ? 1 : 0}
            />
          )
        })}

        {/* Bike position */}
        <circle
          cx={bikePosition.x * scale + offsetX}
          cy={bikePosition.z * scale + offsetY}
          r={3}
          fill="#60a5fa"
          stroke="#ffffff"
          strokeWidth={1}
        />
      </svg>
    </div>
  )
}
