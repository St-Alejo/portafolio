// Physics configuration
export const PHYSICS_CONFIG = {
  maxSpeed: 50,
  acceleration: 20,
  reverseSpeed: 10,
  brakeForce: 5,
  steeringSpeed: 2,
  lateralFriction: 5,
}

// Camera configuration
export const CAMERA_CONFIG = {
  followDistance: 8,
  followHeight: 4,
  lookAheadDistance: 5,
  followSmoothness: 0.1,
  cinematicDuration: 10000,
  freeCameraSpeed: 0.5,
  freeCameraRotationSpeed: 0.003,
}

// Performance configuration
export const PERFORMANCE_CONFIG = {
  shadowMapSize: {
    low: 512,
    high: 2048,
  },
  mobileMaxConcurrency: 4,
}

// Zone configuration for checkpoints
export const ZONES_CONFIG = [
  {
    id: "hero",
    name: "Start Line",
    title: "Welcome",
    description: "Welcome to Steven Ortega's interactive portfolio. Drive through each zone to explore!",
    position: [0, 0, 0],
    radius: 8,
    color: "#60a5fa",
    checkpointIndex: 0,
  },
  {
    id: "about",
    name: "About Zone",
    title: "About Me",
    description: "Learn about Steven's background, skills, and passion for development.",
    position: [50, 0, -10],
    radius: 10,
    color: "#a855f7",
    checkpointIndex: 1,
  },
  {
    id: "projects",
    name: "Projects Zone",
    title: "Projects",
    description: "Explore featured projects and technical achievements.",
    position: [80, 0, -20],
    radius: 10,
    color: "#ec4899",
    checkpointIndex: 2,
  },
  {
    id: "certificates",
    name: "Certificates Zone",
    title: "Certificates",
    description: "View professional certifications and credentials.",
    position: [100, 0, -15],
    radius: 10,
    color: "#f59e0b",
    checkpointIndex: 3,
  },
  {
    id: "testimonials",
    name: "Testimonials Zone",
    title: "Testimonials",
    description: "Read what clients and colleagues say about working with Steven.",
    position: [125, 0, 5],
    radius: 10,
    color: "#10b981",
    checkpointIndex: 4,
  },
  {
    id: "experience",
    name: "Experience Zone",
    title: "Experience",
    description: "Discover Steven's professional journey and work history.",
    position: [115, 0, 30],
    radius: 10,
    color: "#06b6d4",
    checkpointIndex: 5,
  },
  {
    id: "contact",
    name: "Contact Zone",
    title: "Contact",
    description: "Get in touch to discuss opportunities and collaborations.",
    position: [85, 0, 50],
    radius: 10,
    color: "#8b5cf6",
    checkpointIndex: 6,
  },
]