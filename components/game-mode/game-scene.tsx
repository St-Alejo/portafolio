"use client"

import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import { Physics } from "@react-three/rapier"
import { Environment, Sky } from "@react-three/drei"
import { Track } from "./track"
import { BikeController } from "./bike-controller"
import { CameraRig } from "./camera-rig"
import { Effects } from "./effects"
import { useGameStore } from "@/lib/game-store"
import { PERFORMANCE_CONFIG } from "@/lib/game-config"

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#a855f7" />
    </mesh>
  )
}

// Piso temporal para debug
function DebugFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  )
}

function Scene() {
  const lowGraphics = useGameStore((state) => state.lowGraphics)

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={2}
        castShadow={!lowGraphics}
        shadow-mapSize-width={
          lowGraphics ? PERFORMANCE_CONFIG.shadowMapSize.low : PERFORMANCE_CONFIG.shadowMapSize.high
        }
        shadow-mapSize-height={
          lowGraphics ? PERFORMANCE_CONFIG.shadowMapSize.low : PERFORMANCE_CONFIG.shadowMapSize.high
        }
        shadow-camera-far={200}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <pointLight position={[0, 10, 0]} intensity={1} color="#60a5fa" />

      {/* Environment */}
      <Sky sunPosition={[100, 20, 100]} />
      <Environment preset="night" />

      {/* Fog for depth */}
      <fog attach="fog" args={["#0a0a0a", 50, 300]} />

      {/* DEBUG: Piso temporal */}
      <DebugFloor />
      
      {/* Grid helper for reference */}
      <gridHelper args={[100, 100, "#333333", "#555555"]} position={[0, 0.01, 0]} />

      {/* Game objects */}
      <Track />
      <BikeController />
    </>
  )
}

export function GameScene() {
  const lowGraphics = useGameStore((state) => state.lowGraphics)

  // Detect mobile/low-power devices
  const isMobile =
    typeof window !== "undefined" &&
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= PERFORMANCE_CONFIG.mobileMaxConcurrency))

  return (
    <div className="fixed inset-0 w-full h-full">
      <Canvas
        shadows={!lowGraphics && !isMobile}
        camera={{ position: [0, 8, 15], fov: 75, near: 0.1, far: 1000 }}
        gl={{
          antialias: !lowGraphics && !isMobile,
          powerPreference: isMobile ? "low-power" : "high-performance",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Physics gravity={[0, -9.81, 0]} debug={false}>
            <Scene />
            <CameraRig />
          </Physics>
          {!lowGraphics && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  )
}