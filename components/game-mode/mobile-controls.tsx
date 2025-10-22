"use client"

import { useRef, useEffect, useState } from "react"
import { useGameStore } from "@/lib/game-store"
import { Button } from "@/components/ui/button"
import { RotateCcw, Zap, Hand } from "lucide-react"

export function MobileControls() {
  const [isMobile, setIsMobile] = useState(false)
  const setMobileInput = useGameStore((state) => state.setMobileInput)

  const joystickRef = useRef<HTMLDivElement>(null)
  const joystickHandleRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const joystickCenter = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile || !joystickRef.current) return

    const joystick = joystickRef.current
    const handle = joystickHandleRef.current
    if (!handle) return

    const updateJoystickCenter = () => {
      const rect = joystick.getBoundingClientRect()
      joystickCenter.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      }
    }

    updateJoystickCenter()
    window.addEventListener("resize", updateJoystickCenter)

    const handleStart = (clientX: number, clientY: number) => {
      isDragging.current = true
      updateJoystick(clientX, clientY)
    }

    const handleMove = (clientX: number, clientY: number) => {
      if (!isDragging.current) return
      updateJoystick(clientX, clientY)
    }

    const handleEnd = () => {
      isDragging.current = false
      handle.style.transform = "translate(-50%, -50%)"
      setMobileInput({ joystick: { x: 0, y: 0 } })
    }

    const updateJoystick = (clientX: number, clientY: number) => {
      const deltaX = clientX - joystickCenter.current.x
      const deltaY = clientY - joystickCenter.current.y
      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2)
      const maxDistance = 40

      let x = deltaX
      let y = deltaY

      if (distance > maxDistance) {
        x = (deltaX / distance) * maxDistance
        y = (deltaY / distance) * maxDistance
      }

      handle.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`

      // Normalize to -1 to 1 range
      const normalizedX = x / maxDistance
      const normalizedY = -y / maxDistance // Invert Y for forward/backward

      setMobileInput({ joystick: { x: normalizedX, y: normalizedY } })
    }

    // Touch events
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleStart(touch.clientX, touch.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      handleEnd()
    }

    // Mouse events (for testing on desktop)
    const handleMouseDown = (e: MouseEvent) => {
      handleStart(e.clientX, e.clientY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleMouseUp = () => {
      handleEnd()
    }

    joystick.addEventListener("touchstart", handleTouchStart, { passive: false })
    joystick.addEventListener("touchmove", handleTouchMove, { passive: false })
    joystick.addEventListener("touchend", handleTouchEnd, { passive: false })
    joystick.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      joystick.removeEventListener("touchstart", handleTouchStart)
      joystick.removeEventListener("touchmove", handleTouchMove)
      joystick.removeEventListener("touchend", handleTouchEnd)
      joystick.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("resize", updateJoystickCenter)
    }
  }, [isMobile, setMobileInput])

  if (!isMobile) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Joystick - Left side */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div
          ref={joystickRef}
          className="relative w-32 h-32 bg-black/40 backdrop-blur-sm rounded-full border-2 border-purple-500/30"
        >
          <div
            ref={joystickHandleRef}
            className="absolute top-1/2 left-1/2 w-12 h-12 bg-purple-600/80 rounded-full border-2 border-purple-400 transform -translate-x-1/2 -translate-y-1/2 transition-none"
            style={{ touchAction: "none" }}
          >
            <Hand className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" />
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Steering</p>
      </div>

      {/* Action buttons - Right side */}
      <div className="absolute bottom-8 right-8 flex flex-col gap-3 pointer-events-auto">
        <Button
          size="lg"
          className="w-16 h-16 rounded-full bg-purple-600/80 hover:bg-purple-700 border-2 border-purple-400"
          onTouchStart={() => setMobileInput({ throttle: true })}
          onTouchEnd={() => setMobileInput({ throttle: false })}
          onMouseDown={() => setMobileInput({ throttle: true })}
          onMouseUp={() => setMobileInput({ throttle: false })}
        >
          <Zap className="w-6 h-6" />
        </Button>
        <p className="text-xs text-gray-400 text-center">Throttle</p>

        <Button
          size="lg"
          className="w-16 h-16 rounded-full bg-red-600/80 hover:bg-red-700 border-2 border-red-400 mt-2"
          onTouchStart={() => setMobileInput({ brake: true })}
          onTouchEnd={() => setMobileInput({ brake: false })}
          onMouseDown={() => setMobileInput({ brake: true })}
          onMouseUp={() => setMobileInput({ brake: false })}
        >
          <Hand className="w-6 h-6" />
        </Button>
        <p className="text-xs text-gray-400 text-center">Brake</p>

        <Button
          size="lg"
          variant="outline"
          className="w-16 h-16 rounded-full bg-black/40 border-purple-500/30 mt-2"
          onClick={() => {
            // Trigger respawn by simulating 'R' key
            window.dispatchEvent(new KeyboardEvent("keydown", { key: "r" }))
          }}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>
        <p className="text-xs text-gray-400 text-center">Respawn</p>
      </div>
    </div>
  )
}
