"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { type Mesh, Vector3 } from "three"
import { useGameStore } from "@/lib/game-store"
import type { ZONES_CONFIG } from "@/lib/game-config"
import type { ZoneId } from "@/lib/game-store"
import { Text } from "@react-three/drei"

interface ZoneTriggerProps {
  zone: (typeof ZONES_CONFIG)[number]
}

export function ZoneTrigger({ zone }: ZoneTriggerProps) {
  const meshRef = useRef<Mesh>(null)
  const [isActive, setIsActive] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const setZone = useGameStore((state) => state.setZone)
  const setCheckpoint = useGameStore((state) => state.setCheckpoint)
  const setOverlay = useGameStore((state) => state.setOverlay)
  const bikePosition = useGameStore((state) => state.bikePosition)

  useFrame(() => {
    if (!meshRef.current) return

    const zonePosition = new Vector3(...(zone.position as [number, number, number]))
    const distance = bikePosition.distanceTo(zonePosition)

    // Enter zone
    if (distance < zone.radius && !isActive) {
      setIsActive(true)

      // Only trigger overlay once per zone
      if (!hasTriggered) {
        setHasTriggered(true)
        setZone(zone.id as ZoneId)
        setCheckpoint(zone.checkpointIndex)

        // Show overlay
        setOverlay(true, {
          zoneId: zone.id as ZoneId,
          title: zone.title,
          description: zone.description,
        })

        console.log("[v0] Entered zone:", zone.name)
      }
    }
    // Exit zone
    else if (distance >= zone.radius * 1.5 && isActive) {
      setIsActive(false)
      // Reset trigger after leaving zone far enough
      if (distance >= zone.radius * 2) {
        setHasTriggered(false)
      }
    }
  })

  return (
    <group position={zone.position as [number, number, number]}>
      {/* Invisible trigger volume */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[zone.radius, 16, 16]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0} wireframe />
      </mesh>

      {/* Visual marker - Billboard */}
      <group position={[0, 5, 0]}>
        <mesh>
          <planeGeometry args={[6, 3]} />
          <meshStandardMaterial
            color={zone.color}
            emissive={zone.color}
            emissiveIntensity={isActive ? 1 : 0.5}
            transparent
            opacity={0.9}
          />
        </mesh>

        {/* Zone title text */}
        <Text
          position={[0, 0.5, 0.01]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {zone.title}
        </Text>

        {/* Zone name text */}
        <Text
          position={[0, -0.5, 0.01]}
          fontSize={0.3}
          color="#e0e0e0"
          anchorX="center"
          anchorY="middle"
        >
          {zone.name}
        </Text>
      </group>

      {/* Ground marker - Glowing ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[zone.radius * 0.8, zone.radius, 32]} />
        <meshStandardMaterial
          color={zone.color}
          emissive={zone.color}
          emissiveIntensity={isActive ? 0.8 : 0.3}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  )
}