import { create } from "zustand"
import { Vector3, Quaternion } from "three"

export type ZoneId = "hero" | "about" | "projects" | "certificates" | "testimonials" | "experience" | "contact"

interface GameState {
  // Game state
  isGameRunning: boolean
  isPaused: boolean
  currentZone: ZoneId | null
  checkpointIndex: number
  speed: number

  bikePosition: Vector3
  bikeRotation: Quaternion

  // UI state
  isOverlayOpen: boolean
  overlayContent: {
    zoneId: ZoneId
    title: string
    description: string
  } | null

  mobileInput: {
    joystick: { x: number; y: number }
    throttle: boolean
    brake: boolean
  }

  // Camera state
  cameraMode: "follow" | "cinematic" | "free"

  // Settings
  lowGraphics: boolean

  // Actions
  setGameRunning: (running: boolean) => void
  setPaused: (paused: boolean) => void
  setZone: (zoneId: ZoneId) => void
  setCheckpoint: (index: number) => void
  setSpeed: (speed: number) => void
  setBikePosition: (position: Vector3) => void
  setBikeRotation: (rotation: Quaternion) => void
  setOverlay: (open: boolean, content?: GameState["overlayContent"]) => void
  setMobileInput: (input: Partial<GameState["mobileInput"]>) => void
  setCameraMode: (mode: GameState["cameraMode"]) => void
  toggleLowGraphics: () => void
  reset: () => void
}

export const useGameStore = create<GameState>((set) => ({
  // Initial state
  isGameRunning: false,
  isPaused: false,
  currentZone: null,
  checkpointIndex: 0,
  speed: 0,
  bikePosition: new Vector3(0, 2, 0),
  bikeRotation: new Quaternion(),
  isOverlayOpen: false,
  overlayContent: null,
  mobileInput: {
    joystick: { x: 0, y: 0 },
    throttle: false,
    brake: false,
  },
  cameraMode: "follow",
  lowGraphics: false,

  // Actions
  setGameRunning: (running) => set({ isGameRunning: running }),
  setPaused: (paused) => set({ isPaused: paused }),
  setZone: (zoneId) => set({ currentZone: zoneId }),
  setCheckpoint: (index) => set({ checkpointIndex: index }),
  setSpeed: (speed) => set({ speed }),
  setBikePosition: (position) => set({ bikePosition: position }),
  setBikeRotation: (rotation) => set({ bikeRotation: rotation }),
  setOverlay: (open, content) => set({ isOverlayOpen: open, overlayContent: content || null }),
  setMobileInput: (input) =>
    set((state) => ({
      mobileInput: { ...state.mobileInput, ...input },
    })),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  toggleLowGraphics: () => set((state) => ({ lowGraphics: !state.lowGraphics })),
  reset: () =>
    set({
      isGameRunning: false,
      isPaused: false,
      currentZone: null,
      checkpointIndex: 0,
      speed: 0,
      bikePosition: new Vector3(0, 2, 0),
      bikeRotation: new Quaternion(),
      isOverlayOpen: false,
      overlayContent: null,
      mobileInput: {
        joystick: { x: 0, y: 0 },
        throttle: false,
        brake: false,
      },
      cameraMode: "follow",
    }),
}))
