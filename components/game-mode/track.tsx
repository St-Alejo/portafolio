"use client"

import { RigidBody } from "@react-three/rapier"
import { useRef } from "react"
import { type Mesh, Vector3 } from "three"
import { ZoneTrigger } from "./zone-trigger"
import { ZONES_CONFIG } from "@/lib/game-config"
import { CheckpointParticles } from "./particles"

// Helper function to create curved track segments
function createTrackPath() {
  const points: Vector3[] = []

  // Start straight
  for (let i = 0; i <= 20; i++) {
    points.push(new Vector3(i * 2, 0, 0))
  }

  // Curve 1 (right turn) - About Me
  for (let i = 0; i <= 20; i++) {
    const angle = (i / 20) * (Math.PI / 2)
    const x = 40 + Math.sin(angle) * 20
    const z = -20 + Math.cos(angle) * 20
    points.push(new Vector3(x, 0, z))
  }

  // Straight 1 - Projects
  for (let i = 1; i <= 15; i++) {
    points.push(new Vector3(60 + i * 2, 0, -20))
  }

  // Chicane - Certificates
  for (let i = 0; i <= 10; i++) {
    const x = 90 + i * 2
    const z = -20 + Math.sin((i / 10) * Math.PI * 2) * 5
    points.push(new Vector3(x, 0, z))
  }

  // S-bend - Testimonials
  for (let i = 1; i <= 15; i++) {
    const x = 110 + i * 1.5
    const z = Math.sin((i / 15) * Math.PI) * 15
    points.push(new Vector3(x, 0, z))
  }

  // Curve 3 (left turn) - Experience
  for (let i = 0; i <= 20; i++) {
    const angle = (i / 20) * (Math.PI / 2)
    const x = 132.5 - Math.sin(angle) * 20
    const z = 15 + Math.cos(angle) * 20
    points.push(new Vector3(x, 0, z))
  }

  // Final straight to finish - Contact
  for (let i = 1; i <= 15; i++) {
    points.push(new Vector3(112.5 - i * 2, 0, 35 + i * 1.5))
  }

  return points
}

export function Track() {
  const trackRef = useRef<Mesh>(null)
  const trackPath = createTrackPath()

  return (
    <group>
      {/* Ground plane - más oscuro y atmosférico */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh ref={trackRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[60, -0.5, 20]}>
          <planeGeometry args={[300, 200]} />
          <meshStandardMaterial 
            color="#050508" 
            roughness={0.95} 
            metalness={0.05}
          />
        </mesh>
      </RigidBody>

      {/* Track surface segments - con textura mejorada */}
      {trackPath.map((point, index) => {
        if (index === 0) return null
        const prevPoint = trackPath[index - 1]
        const midPoint = new Vector3().addVectors(point, prevPoint).multiplyScalar(0.5)
        const direction = new Vector3().subVectors(point, prevPoint)
        const length = direction.length()
        const angle = Math.atan2(direction.x, direction.z)

        return (
          <RigidBody key={index} type="fixed" colliders="cuboid">
            <mesh position={[midPoint.x, 0.05, midPoint.z]} rotation={[0, -angle, 0]} receiveShadow castShadow>
              <boxGeometry args={[10, 0.1, length]} />
              <meshStandardMaterial
                color="#1a1a2e"
                roughness={0.6}
                metalness={0.3}
                emissive="#2a1a4e"
                emissiveIntensity={0.15}
              />
            </mesh>
            
            {/* Líneas laterales de pista */}
            {index % 2 === 0 && (
              <>
                <mesh position={[midPoint.x + 4.8, 0.11, midPoint.z]} rotation={[0, -angle, 0]}>
                  <boxGeometry args={[0.3, 0.05, length]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.3}
                  />
                </mesh>
                <mesh position={[midPoint.x - 4.8, 0.11, midPoint.z]} rotation={[0, -angle, 0]}>
                  <boxGeometry args={[0.3, 0.05, length]} />
                  <meshStandardMaterial
                    color="#ffffff"
                    emissive="#ffffff"
                    emissiveIntensity={0.3}
                  />
                </mesh>
              </>
            )}
          </RigidBody>
        )
      })}

      {/* Track boundaries - Left side con efecto neón */}
      {trackPath.map((point, index) => {
        if (index === 0 || index % 3 !== 0) return null
        const nextIndex = Math.min(index + 1, trackPath.length - 1)
        const direction = new Vector3().subVectors(trackPath[nextIndex], point).normalize()
        const perpendicular = new Vector3(-direction.z, 0, direction.x).multiplyScalar(6)
        const wallPos = new Vector3().addVectors(point, perpendicular)

        return (
          <RigidBody key={`wall-left-${index}`} type="fixed" colliders="cuboid">
            <mesh position={[wallPos.x, 2, wallPos.z]} castShadow>
              <boxGeometry args={[1.5, 4, 1.5]} />
              <meshStandardMaterial
                color="#16213e"
                emissive="#7c3aed"
                emissiveIntensity={0.4}
                transparent
                opacity={0.7}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            {/* Luz superior del poste */}
            <pointLight position={[wallPos.x, 4.5, wallPos.z]} intensity={0.5} color="#7c3aed" distance={8} />
          </RigidBody>
        )
      })}

      {/* Track boundaries - Right side con efecto neón */}
      {trackPath.map((point, index) => {
        if (index === 0 || index % 3 !== 0) return null
        const nextIndex = Math.min(index + 1, trackPath.length - 1)
        const direction = new Vector3().subVectors(trackPath[nextIndex], point).normalize()
        const perpendicular = new Vector3(-direction.z, 0, direction.x).multiplyScalar(-6)
        const wallPos = new Vector3().addVectors(point, perpendicular)

        return (
          <RigidBody key={`wall-right-${index}`} type="fixed" colliders="cuboid">
            <mesh position={[wallPos.x, 2, wallPos.z]} castShadow>
              <boxGeometry args={[1.5, 4, 1.5]} />
              <meshStandardMaterial
                color="#16213e"
                emissive="#a855f7"
                emissiveIntensity={0.4}
                transparent
                opacity={0.7}
                roughness={0.3}
                metalness={0.7}
              />
            </mesh>
            {/* Luz superior del poste */}
            <pointLight position={[wallPos.x, 4.5, wallPos.z]} intensity={0.5} color="#a855f7" distance={8} />
          </RigidBody>
        )
      })}

      {/* Start/Finish line mejorada */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 3]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.8}
          roughness={0.5}
        />
      </mesh>

      {/* Checkered pattern on start line */}
      {[...Array(5)].map((_, i) =>
        [...Array(3)].map((_, j) => (
          <mesh
            key={`checker-${i}-${j}`}
            position={[-4 + i * 2 + (j % 2), 0.12, -1 + j]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        )),
      )}

      {/* Arco de salida decorativo */}
      <group position={[0, 0, -2]}>
        <mesh position={[-6, 3, 0]} castShadow>
          <boxGeometry args={[1, 6, 1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#60a5fa"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[6, 3, 0]} castShadow>
          <boxGeometry args={[1, 6, 1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#60a5fa"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh position={[0, 6, 0]} castShadow>
          <boxGeometry args={[13, 1, 1]} />
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#60a5fa"
            emissiveIntensity={0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <pointLight position={[0, 6, 0]} intensity={2} color="#60a5fa" distance={20} />
      </group>

      {/* Zone triggers with particles */}
      {ZONES_CONFIG.map((zone) => (
        <group key={zone.id}>
          <ZoneTrigger zone={zone} />
          <CheckpointParticles position={zone.position as [number, number, number]} />
        </group>
      ))}

      {/* Decorative elements - Pit lane markers mejorados */}
      {[...Array(10)].map((_, i) => (
        <group key={`pit-${i}`} position={[-8, 0, i * 5 - 15]}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
            <meshStandardMaterial 
              color="#ff6b6b" 
              emissive="#ff6b6b" 
              emissiveIntensity={0.6}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
          <pointLight position={[0, 2, 0]} intensity={0.3} color="#ff6b6b" distance={5} />
        </group>
      ))}
    </group>
  )
}