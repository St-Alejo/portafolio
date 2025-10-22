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

    const steeringFactor = Math.min(currentSpeed / 10, 1) // More responsive at higher speeds

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
      // Bike is tipping, apply corrective torque
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
        {/* Placeholder bike model - TODO: Replace with actual GLTF model from /assets/models/motorbike.glb */}
        <mesh castShadow>
          <boxGeometry args={[1, 0.8, 2]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7c3aed"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Front indicator */}
        <mesh position={[0, 0.5, -1.2]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#60a5fa" emissive="#60a5fa" emissiveIntensity={1} />
        </mesh>

        {/* Wheels */}
        <mesh position={[0.4, -0.3, 0.6]} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[-0.4, -0.3, 0.6]} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.3, -0.8]} castShadow rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.25, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.6} roughness={0.4} />
        </mesh>

        {/* Exhaust particles - only show when moving */}
        {speed > 2 && <BikeExhaust position={exhaustPosition} />}
      </group>
    </RigidBody>
  )
}