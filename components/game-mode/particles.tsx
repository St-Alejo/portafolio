"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Points, PointMaterial } from "@react-three/drei"
import * as THREE from "three"

interface ParticleSystemProps {
  count?: number
  position?: [number, number, number]
  color?: string
  size?: number
  speed?: number
}

export function ParticleSystem({
  count = 100,
  position = [0, 0, 0],
  color = "#a855f7",
  size = 0.05,
  speed = 0.5,
}: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = Math.random() * 5
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10

      velocities[i * 3] = (Math.random() - 0.5) * speed
      velocities[i * 3 + 1] = Math.random() * speed
      velocities[i * 3 + 2] = (Math.random() - 0.5) * speed
    }

    return { positions, velocities }
  }, [count, speed])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < count; i++) {
      positions[i * 3] += particles.velocities[i * 3] * delta
      positions[i * 3 + 1] += particles.velocities[i * 3 + 1] * delta
      positions[i * 3 + 2] += particles.velocities[i * 3 + 2] * delta

      // Reset particles that go too far
      if (Math.abs(positions[i * 3]) > 5) positions[i * 3] = -positions[i * 3]
      if (positions[i * 3 + 1] > 5) positions[i * 3 + 1] = 0
      if (Math.abs(positions[i * 3 + 2]) > 5) positions[i * 3 + 2] = -positions[i * 3 + 2]
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={particles.positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  )
}

export function CheckpointParticles({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <ParticleSystem count={50} color="#a855f7" size={0.1} speed={0.3} />
    </group>
  )
}

export function BikeExhaust({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 20
  const lifetime = useRef(new Float32Array(particleCount))

  const particles = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      lifetime.current[i] = Math.random()
    }
    return positions
  }, [particleCount])

  useFrame((state, delta) => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array

    for (let i = 0; i < particleCount; i++) {
      lifetime.current[i] -= delta * 2

      if (lifetime.current[i] <= 0) {
        // Reset particle
        positions[i * 3] = position[0] + (Math.random() - 0.5) * 0.5
        positions[i * 3 + 1] = position[1] + 0.2
        positions[i * 3 + 2] = position[2] + (Math.random() - 0.5) * 0.5
        lifetime.current[i] = 1
      } else {
        // Move particle backward and up
        positions[i * 3 + 1] += delta * 0.5
        positions[i * 3 + 2] += delta * 2
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.15}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  )
}
