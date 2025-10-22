// Physics configuration
export const PHYSICS_CONFIG = {
  // Vehicle physics
  maxSpeed: 80,
  acceleration: 25,
  brakeForce: 40,
  reverseSpeed: 20,
  steeringSpeed: 2.5,
  steeringClamp: 0.5,

  // Drift & handling
  driftFactor: 0.95,
  lateralFriction: 0.8,

  // Suspension (approximated)
  suspensionStiffness: 30,
  suspensionDamping: 2.5,

  // Collision
  bounceFactor: 0.3,
  collisionSlowdown: 0.6,

  // World
  gravity: -9.81,
} as const

// Camera configuration
export const CAMERA_CONFIG = {
  // Follow camera
  followDistance: 8,
  followHeight: 3.5,
  followSmoothness: 0.1,
  lookAheadDistance: 2,

  // Cinematic camera
  cinematicDuration: 1200, // ms
  cinematicEasing: "easeInOutCubic",

  // Free camera
  freeCameraSpeed: 0.5,
  freeCameraRotationSpeed: 0.002,

  // Field of view
  fov: 75,
  near: 0.1,
  far: 1000,
} as const

// Zone configuration
export const ZONES_CONFIG = [
  {
    id: "hero" as const,
    name: "Start / Pit Lane",
    title: "Hi, I'm Steven Ortega",
    description: "Full Stack Developer passionate about Artificial Intelligence and technology",
    position: [0, 0, 0],
    radius: 12,
    checkpointIndex: 0,
    color: "#a855f7",
  },
  {
    id: "about" as const,
    name: "Curve 1",
    title: "About Me",
    description: "Get to know more about my background, skills, and passion for development",
    position: [50, 0, -20],
    radius: 15,
    checkpointIndex: 1,
    color: "#8b5cf6",
  },
  {
    id: "projects" as const,
    name: "Straight 1",
    title: "Projects",
    description: "Explore my portfolio of web and mobile applications",
    position: [75, 0, -20],
    radius: 15,
    checkpointIndex: 2,
    color: "#7c3aed",
  },
  {
    id: "certificates" as const,
    name: "Chicane",
    title: "Certificates",
    description: "View my professional certifications and achievements",
    position: [100, 0, -15],
    radius: 12,
    checkpointIndex: 3,
    color: "#6d28d9",
  },
  {
    id: "testimonials" as const,
    name: "S-bend",
    title: "Testimonials",
    description: "Read what clients and collaborators say about working with me",
    position: [120, 0, 5],
    radius: 12,
    checkpointIndex: 4,
    color: "#5b21b6",
  },
  {
    id: "experience" as const,
    name: "Curve 3",
    title: "Experience",
    description: "Discover my professional journey and key roles",
    position: [120, 0, 30],
    radius: 12,
    checkpointIndex: 5,
    color: "#4c1d95",
  },
  {
    id: "contact" as const,
    name: "Finish / Podium",
    title: "Contact",
    description: "Get in touch and download my CV",
    position: [85, 0, 50],
    radius: 15,
    checkpointIndex: 6,
    color: "#3b0764",
  },
] as const

// Performance settings
export const PERFORMANCE_CONFIG = {
  // LOD distances
  lodHigh: 50,
  lodMedium: 100,
  lodLow: 200,

  // Asset loading
  lazyLoadDistance: 100,
  preloadDistance: 50,

  // Mobile detection
  mobileMaxMemory: 4, // GB
  mobileMaxConcurrency: 4,

  // Graphics quality
  shadowMapSize: {
    high: 2048,
    medium: 1024,
    low: 512,
  },
  antialias: {
    high: true,
    medium: true,
    low: false,
  },
} as const
