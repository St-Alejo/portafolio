"use client"

import { GameScene } from "./game-scene"
import { UIOverlay } from "./ui-overlay"
import { HUD } from "./hud"
import { MobileControls } from "./mobile-controls"
import { LoadingScreen } from "./loading-screen"
import { StartMenu } from "./start-menu"
import { FinishScreen } from "./finish-screen"
import { useGameStore } from "@/lib/game-store"
import { useEffect, useState } from "react"
import { Suspense } from "react"

export function GameMode() {
  const setGameRunning = useGameStore((state) => state.setGameRunning)
  const reset = useGameStore((state) => state.reset)
  const [isLoading, setIsLoading] = useState(true)
  const [showStartMenu, setShowStartMenu] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)

  useEffect(() => {
    return () => {
      setGameRunning(false)
      reset()
    }
  }, [setGameRunning, reset])

  const handleLoadComplete = () => {
    setIsLoading(false)
  }

  const handleStart = () => {
    setShowStartMenu(false)
    setGameStarted(true)
    setGameRunning(true)
  }

  const handleRestart = () => {
    reset()
    setGameStarted(true)
    setGameRunning(true)
  }

  const handleExit = () => {
    // TODO: Navigate back to main portfolio
    console.log("[v0] Exit game mode")
    reset()
    setShowStartMenu(true)
    setGameStarted(false)
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <Suspense fallback={<LoadingScreen onLoadComplete={handleLoadComplete} />}>
        {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}

        {!isLoading && showStartMenu && <StartMenu onStart={handleStart} />}

        {!isLoading && gameStarted && (
          <>
            <GameScene />
            <UIOverlay />
            <HUD />
            <MobileControls />
            <FinishScreen onRestart={handleRestart} onExit={handleExit} />
          </>
        )}
      </Suspense>
    </div>
  )
}
