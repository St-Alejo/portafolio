"use client"

import { useEffect, useState } from "react"

interface LoadingScreenProps {
  onLoadComplete: () => void
}

export function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          // Call onLoadComplete after loading finishes
          setTimeout(() => {
            onLoadComplete()
          }, 500)
          return 100
        }
        return prev + 2 // Increment by 2% every interval
      })
    }, 50) // Update every 50ms

    return () => clearInterval(interval)
  }, [onLoadComplete])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black">
      {/* Animated circle */}
      <div className="relative mb-8">
        <svg className="h-32 w-32 animate-spin" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset="75"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Title */}
      <h1 className="mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-5xl font-bold text-transparent">
        Loading Game Mode
      </h1>

      {/* Subtitle */}
      <p className="mb-8 text-lg text-gray-400">Preparing your racing experience...</p>

      {/* Progress bar */}
      <div className="w-96 overflow-hidden rounded-full bg-gray-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-4 text-2xl font-semibold text-gray-300">{progress}%</p>
    </div>
  )
}