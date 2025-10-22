"use client"

import { useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Vector3, Euler, MathUtils } from "three"
import { useGameStore } from "@/lib/game-store"
import { CAMERA_CONFIG } from "@/lib/game-config"

export function CameraRig() {
  const { camera } = useThree()
  const cameraMode = useGameStore((state) => state.cameraMode)
  const setCameraMode = useGameStore((state) => state.setCameraMode)
  const bikePosition = useGameStore((state) => state.bikePosition)
  const bikeRotation = useGameStore((state) => state.bikeRotation)
  const isPaused = useGameStore((state) => state.isPaused)

  // Target position for smooth following
  const targetPosition = useRef(new Vector3())
  const targetLookAt = useRef(new Vector3())
  const currentVelocity = useRef(new Vector3())

  // Cinematic camera state
  const cinematicStartTime = useRef(0)
  const cinematicStartPos = useRef(new Vector3())
  const cinematicTargetPos = useRef(new Vector3())
  const cinematicActive = useRef(false)

  // Free camera state
  const freeCameraRotation = useRef({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Handle camera mode switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "c") {
        const modes: Array<"follow" | "cinematic" | "free"> = ["follow", "free"]
        const currentIndex = modes.indexOf(cameraMode)
        const nextMode = modes[(currentIndex + 1) % modes.length]
        setCameraMode(nextMode)
        console.log("[v0] Camera mode:", nextMode)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [cameraMode, setCameraMode])

  // Free camera mouse controls
  useEffect(() => {
    if (cameraMode !== "free") return

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 2) {
        // Right click
        isDragging.current = true
        lastMousePos.current = { x: e.clientX, y: e.clientY }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return

      const deltaX = e.clientX - lastMousePos.current.x
      const deltaY = e.clientY - lastMousePos.current.y

      freeCameraRotation.current.y -= deltaX * CAMERA_CONFIG.freeCameraRotationSpeed
      freeCameraRotation.current.x -= deltaY * CAMERA_CONFIG.freeCameraRotationSpeed

      // Clamp vertical rotation
      freeCameraRotation.current.x = MathUtils.clamp(freeCameraRotation.current.x, -Math.PI / 2, Math.PI / 2)

      lastMousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseUp = () => {
      isDragging.current = false
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    window.addEventListener("contextmenu", handleContextMenu)

    return () => {
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      window.removeEventListener("contextmenu", handleContextMenu)
    }
  }, [cameraMode])

  useFrame((state: { clock: { elapsedTime: number } }, delta: number) => {
    if (isPaused) return

    // Get bike orientation
    const euler = new Euler().setFromQuaternion(bikeRotation)
    const bikeYaw = euler.y

    if (cameraMode === "follow") {
      // Calculate follow camera position behind and above the bike
      const offset = new Vector3(
        Math.sin(bikeYaw) * CAMERA_CONFIG.followDistance,
        CAMERA_CONFIG.followHeight,
        Math.cos(bikeYaw) * CAMERA_CONFIG.followDistance,
      )

      targetPosition.current.copy(bikePosition).add(offset)

      // Look ahead of the bike
      const lookAhead = new Vector3(
        -Math.sin(bikeYaw) * CAMERA_CONFIG.lookAheadDistance,
        0,
        -Math.cos(bikeYaw) * CAMERA_CONFIG.lookAheadDistance,
      )
      targetLookAt.current.copy(bikePosition).add(lookAhead)

      // Smooth camera movement with spring physics
      const springStrength = CAMERA_CONFIG.followSmoothness
      const displacement = new Vector3().subVectors(targetPosition.current, camera.position)
      currentVelocity.current.add(displacement.multiplyScalar(springStrength))
      currentVelocity.current.multiplyScalar(0.9) // Damping

      camera.position.add(currentVelocity.current)

      // Smooth look-at
      const currentLookAt = new Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position)
      const lookAtDelta = new Vector3().subVectors(targetLookAt.current, currentLookAt)
      const newLookAt = currentLookAt.add(lookAtDelta.multiplyScalar(springStrength * 2))

      camera.lookAt(newLookAt)
    } else if (cameraMode === "cinematic") {
      // Cinematic camera - orbit around bike
      if (!cinematicActive.current) {
        cinematicActive.current = true
        cinematicStartTime.current = state.clock.elapsedTime
        cinematicStartPos.current.copy(camera.position)
      }

      const elapsed = (state.clock.elapsedTime - cinematicStartTime.current) * 1000
      const progress = Math.min(elapsed / CAMERA_CONFIG.cinematicDuration, 1)

      // Circular orbit
      const angle = bikeYaw + progress * Math.PI * 2
      const radius = 12
      const height = 5

      const cinematicPos = new Vector3(
        bikePosition.x + Math.sin(angle) * radius,
        bikePosition.y + height,
        bikePosition.z + Math.cos(angle) * radius,
      )

      camera.position.lerp(cinematicPos, 0.05)
      camera.lookAt(bikePosition)

      // Reset after one orbit
      if (progress >= 1) {
        cinematicActive.current = false
        setCameraMode("follow")
      }
    } else if (cameraMode === "free") {
      // Free camera - manual control
      cinematicActive.current = false

      // WASD movement in free camera
      const moveSpeed = CAMERA_CONFIG.freeCameraSpeed
      const forward = new Vector3(0, 0, -1).applyEuler(
        new Euler(freeCameraRotation.current.x, freeCameraRotation.current.y, 0),
      )
      const right = new Vector3(1, 0, 0).applyEuler(new Euler(0, freeCameraRotation.current.y, 0))

      // Apply rotation
      camera.rotation.set(freeCameraRotation.current.x, freeCameraRotation.current.y, 0)

      // Keep camera at a reasonable distance from bike
      const distanceToBike = camera.position.distanceTo(bikePosition)
      if (distanceToBike > 50) {
        camera.position.lerp(bikePosition, 0.01)
      }
    }
  })

  return null
}