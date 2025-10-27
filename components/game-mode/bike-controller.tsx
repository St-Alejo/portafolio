"use client"

import { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import { type Group, Vector3, Quaternion, Euler } from "three"
import { useGameStore } from "@/lib/game-store"
import { PHYSICS_CONFIG } from "@/lib/game-config"
import { BikeExhaust } from "./particles"

export function BikeController() {
  const bikeRef = useRef<any>(null)
  const groupRef = useRef<Group>(null)
  const setSpeed = useGameStore((state) => state.setSpeed)
  const setBikePosition = useGameStore((state) => state.setBikePosition)
  const setBikeRotation = useGameStore((state) => state.setBikeRotation)
  const isPaused = useGameStore((state) => state.isPaused)
  const mobileInput = useGameStore((state) => state.mobileInput)
  const speed = useGameStore((state) => state.speed)

  const spawnPosition = useRef(new Vector3(0, 2, 0))

  // Input state
  const keysPressed = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    brake: false,
  })

  const respawn = () => {
    if (bikeRef.current) {
      bikeRef.current.setTranslation(
        { x: spawnPosition.current.x, y: spawnPosition.current.y, z: spawnPosition.current.z },
        true,
      )
      bikeRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      bikeRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      bikeRef.current.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true)
      console.log("[v0] Bike respawned at checkpoint")
    }
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          keysPressed.current.forward = true
          break
        case "s":
        case "arrowdown":
          keysPressed.current.backward = true
          break
        case "a":
        case "arrowleft":
          keysPressed.current.left = true
          break
        case "d":
        case "arrowright":
          keysPressed.current.right = true
          break
        case " ":
          e.preventDefault()
          keysPressed.current.brake = true
          break
        case "r":
          respawn()
          break
        case "c":
          // Camera toggle - handled in camera rig
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          keysPressed.current.forward = false
          break
        case "s":
        case "arrowdown":
          keysPressed.current.backward = false
          break
        case "a":
        case "arrowleft":
          keysPressed.current.left = false
          break
        case "d":
        case "arrowright":
          keysPressed.current.right = false
          break
        case " ":
          keysPressed.current.brake = false
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  useFrame((_state: any, delta: number) => {
    if (!bikeRef.current || isPaused) return

    const body = bikeRef.current
    const velocity = body.linvel()
    const currentSpeed = Math.sqrt(velocity.x ** 2 + velocity.z ** 2)

    const position = body.translation()
    const rotation = body.rotation()
    setBikePosition(new Vector3(position.x, position.y, position.z))
    setBikeRotation(new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w))

    // Update speed in store
    setSpeed(currentSpeed)

    // Get current rotation and forward direction
    const quat = new Quaternion(rotation.x, rotation.y, rotation.z, rotation.w)
    const forward = new Vector3(0, 0, -1).applyQuaternion(quat)
    const right = new Vector3(1, 0, 0).applyQuaternion(quat)

    const inputForward = keysPressed.current.forward || mobileInput.throttle || mobileInput.joystick.y > 0.2
    const inputBackward = keysPressed.current.backward || mobileInput.joystick.y < -0.2
    const inputLeft = keysPressed.current.left || mobileInput.joystick.x < -0.2
    const inputRight = keysPressed.current.right || mobileInput.joystick.x > 0.2
    const inputBrake = keysPressed.current.brake || mobileInput.brake

    const steeringIntensity = Math.abs(mobileInput.joystick.x) > 0.2 ? Math.abs(mobileInput.joystick.x) : 1

    // Apply forces based on input
    const force = new Vector3(0, 0, 0)

    if (inputForward) {
      if (currentSpeed < PHYSICS_CONFIG.maxSpeed) {
        const accelForce = PHYSICS_CONFIG.acceleration * (1 - currentSpeed / PHYSICS_CONFIG.maxSpeed)
        force.add(forward.clone().multiplyScalar(accelForce))
      }
    }

    if (inputBackward) {
      if (currentSpeed > -PHYSICS_CONFIG.reverseSpeed) {
        force.add(forward.clone().multiplyScalar(-PHYSICS_CONFIG.acceleration * 0.5))
      }
    }

    if (inputBrake && currentSpeed > 0.5) {
      const brakeForce = forward.clone().multiplyScalar(-currentSpeed * PHYSICS_CONFIG.brakeForce * delta)
      force.add(brakeForce)
    }

    const steeringFactor = Math.min(currentSpeed / 10, 1)

    if (inputLeft && currentSpeed > 1) {
      const angularVel = body.angvel()
      body.setAngvel(
        {
          x: angularVel.x,
          y: PHYSICS_CONFIG.steeringSpeed * steeringIntensity * steeringFactor,
          z: angularVel.z,
        },
        true,
      )

      if (groupRef.current) {
        const targetLean = -0.3 * steeringIntensity
        const currentRotation = groupRef.current.rotation
        groupRef.current.rotation.z += (targetLean - currentRotation.z) * 0.1
      }
    }

    if (inputRight && currentSpeed > 1) {
      const angularVel = body.angvel()
      body.setAngvel(
        {
          x: angularVel.x,
          y: -PHYSICS_CONFIG.steeringSpeed * steeringIntensity * steeringFactor,
          z: angularVel.z,
        },
        true,
      )

      if (groupRef.current) {
        const targetLean = 0.3 * steeringIntensity
        const currentRotation = groupRef.current.rotation
        groupRef.current.rotation.z += (targetLean - currentRotation.z) * 0.1
      }
    }

    if (!inputLeft && !inputRight && groupRef.current) {
      groupRef.current.rotation.z *= 0.9
    }

    // Apply force
    if (force.length() > 0) {
      body.applyImpulse(force, true)
    }

    const lateralVelocity = right.clone()
    const lateralSpeed = lateralVelocity.dot(new Vector3(velocity.x, 0, velocity.z))
    const friction = lateralVelocity.multiplyScalar(-lateralSpeed * PHYSICS_CONFIG.lateralFriction * delta * 100)
    body.applyImpulse(friction, true)

    if (!inputForward && !inputBackward && currentSpeed > 0.1) {
      const resistance = forward.clone().multiplyScalar(-currentSpeed * 0.5 * delta)
      body.applyImpulse(resistance, true)
    }

    const euler = new Euler().setFromQuaternion(quat)
    if (Math.abs(euler.x) > 0.5 || Math.abs(euler.z) > 0.5) {
      body.setAngvel({ x: 0, y: body.angvel().y, z: 0 }, true)
    }

    if (position.y < -5) {
      console.log("[v0] Bike fell off track, respawning")
      respawn()
    }
  })

  const exhaustPosition: [number, number, number] = [0, 0.3, 1]

  return (
    <RigidBody
      ref={bikeRef}
      position={[0, 2, 0]}
      colliders="cuboid"
      mass={200}
      linearDamping={0.5}
      angularDamping={0.5}
      enabledRotations={[false, true, false]}
    >
      <group ref={groupRef}>
        {/* Cuerpo principal de la moto - más aerodinámico */}
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.6, 2.2]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7c3aed"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Asiento */}
        <mesh position={[0, 0.5, 0.3]} castShadow>
          <boxGeometry args={[0.8, 0.3, 1]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.3}
            roughness={0.7}
          />
        </mesh>

        {/* Tanque de combustible */}
        <mesh position={[0, 0.4, -0.5]} castShadow>
          <boxGeometry args={[0.7, 0.5, 0.8]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#7c3aed"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Faro delantero mejorado */}
        <mesh position={[0, 0.5, -1.3]} castShadow>
          <boxGeometry args={[0.6, 0.4, 0.3]} />
          <meshStandardMaterial 
            color="#60a5fa" 
            emissive="#60a5fa" 
            emissiveIntensity={1.5}
            metalness={1}
            roughness={0}
          />
        </mesh>
        <pointLight position={[0, 0.5, -1.5]} intensity={3} color="#60a5fa" distance={15} />

        {/* Luces traseras */}
        <mesh position={[0.3, 0.6, 1.1]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.1]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
        </mesh>
        <mesh position={[-0.3, 0.6, 1.1]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.1]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={1} />
        </mesh>

        {/* Rueda delantera mejorada */}
        <group position={[0, -0.3, -0.9]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.3, 24]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Disco de freno */}
          <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
            <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Rueda trasera derecha */}
        <group position={[0.45, -0.3, 0.7]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 24]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Disco de freno */}
          <mesh position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
            <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Rueda trasera izquierda */}
        <group position={[-0.45, -0.3, 0.7]}>
          <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.35, 0.35, 0.25, 24]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Disco de freno */}
          <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.05, 16]} />
            <meshStandardMaterial color="#444444" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Manubrio */}
        <mesh position={[0, 0.7, -0.8]} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
          <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Carenado lateral derecho */}
        <mesh position={[0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.8, 1.8]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#4f46e5"
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Carenado lateral izquierdo */}
        <mesh position={[-0.6, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.8, 1.8]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#4f46e5"
            emissiveIntensity={0.2}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Spoiler trasero */}
        <mesh position={[0, 0.9, 0.9]} castShadow>
          <boxGeometry args={[0.9, 0.05, 0.4]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#7c3aed"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Sistema de escape */}
        <mesh position={[0.4, -0.2, 0.8]} castShadow rotation={[0, 0, Math.PI / 6]}>
          <cylinderGeometry args={[0.1, 0.12, 0.6, 12]} />
          <meshStandardMaterial
            color="#333333"
            metalness={0.95}
            roughness={0.1}
            emissive="#ff6b00"
            emissiveIntensity={speed > 5 ? 0.3 : 0}
          />
        </mesh>

        {/* Exhaust particles - solo mostrar cuando se mueve */}
        {speed > 2 && <BikeExhaust position={exhaustPosition} />}
        
        {/* Efecto de velocidad - trail lights */}
        {speed > 15 && (
          <>
            <pointLight position={[0.5, 0, 0.5]} intensity={0.5} color="#a855f7" distance={3} />
            <pointLight position={[-0.5, 0, 0.5]} intensity={0.5} color="#60a5fa" distance={3} />
          </>
        )}
      </group>
    </RigidBody>
  )
}