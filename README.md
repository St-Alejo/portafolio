# Steven Ortega Portfolio - Game Mode

An immersive 3D motorcycle racing experience integrated into the portfolio, where users drive through different zones to explore portfolio sections.

## Features

- **3D Racing Experience**: Drive a motorcycle through a custom racetrack
- **Portfolio Integration**: Each track zone corresponds to a portfolio section (Hero, About, Projects, Certificates, Testimonials, Experience, Contact)
- **Realistic Physics**: Arcade-style motorcycle physics with Rapier physics engine
- **Multiple Camera Modes**: Follow camera, cinematic orbit, and free camera
- **Visual Effects**: Particle systems, bloom, vignette, and chromatic aberration
- **Responsive Controls**: 
  - Desktop: WASD/Arrow keys, Space for brake, R for respawn, C for camera mode
  - Mobile: On-screen joystick and touch buttons
- **Performance Optimized**: LOD system, mobile detection, and graphics quality toggle

## Tech Stack

- **React Three Fiber** - 3D rendering
- **@react-three/drei** - 3D helpers and utilities
- **@react-three/rapier** - Physics engine
- **@react-three/postprocessing** - Visual effects
- **Zustand** - State management
- **Next.js** - Framework
- **Tailwind CSS** - Styling

## Getting Started

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000/game` to access the Game Mode.

### Build

\`\`\`bash
npm run build
\`\`\`

## Project Structure

\`\`\`
components/game-mode/
├── index.tsx              # Main GameMode component
├── game-scene.tsx         # 3D Canvas and scene setup
├── bike-controller.tsx    # Motorcycle physics and controls
├── track.tsx              # Racetrack geometry and zones
├── zone-trigger.tsx       # Zone detection and triggers
├── camera-rig.tsx         # Camera system
├── particles.tsx          # Particle effects
├── effects.tsx            # Post-processing effects
├── ui-overlay.tsx         # Zone information overlays
├── hud.tsx                # Heads-up display
├── minimap.tsx            # Track minimap
├── mobile-controls.tsx    # Touch controls for mobile
├── loading-screen.tsx     # Asset loading screen
├── start-menu.tsx         # Game start menu
└── finish-screen.tsx      # Completion screen

lib/
├── game-store.ts          # Zustand state management
└── game-config.ts         # Physics and game configuration

app/game/
└── page.tsx               # Game Mode page route
\`\`\`

## Configuration

### Physics Settings

Edit `lib/game-config.ts` to adjust:
- `maxSpeed` - Maximum bike speed
- `acceleration` - Acceleration force
- `steeringSpeed` - Steering responsiveness
- `lateralFriction` - Drift behavior

### Camera Settings

Adjust camera behavior in `CAMERA_CONFIG`:
- `followDistance` - Distance behind bike
- `followHeight` - Height above bike
- `followSmoothness` - Camera smoothing factor

### Zone Configuration

Modify `ZONES_CONFIG` to change:
- Zone positions on track
- Trigger radius
- Zone titles and descriptions
- Colors

## Asset Placeholders

The following assets need to be replaced for production:

### 3D Models
- `/assets/models/motorbike.glb` - Motorcycle model (DRACO compressed)
- `/assets/models/track.glb` - Track model with colliders

### Textures
- `/assets/textures/` - Track textures, billboards

### Content
- `/assets/content/project-*.jpg` - Project images
- `/assets/content/cert-*.jpg` - Certificate images

### Links
Update placeholder links in:
- `components/game-mode/ui-overlay.tsx` - Section navigation
- Social media links (GitHub, LinkedIn, WhatsApp)
- CV download link

## Controls

### Desktop
- **W / ↑** - Accelerate
- **S / ↓** - Brake / Reverse
- **A / ←** - Steer Left
- **D / →** - Steer Right
- **Space** - Handbrake
- **R** - Respawn at checkpoint
- **C** - Toggle camera mode
- **M** - Toggle minimap
- **ESC** - Pause / Close overlay

### Mobile
- **Left Joystick** - Steering
- **Right Buttons** - Throttle, Brake, Respawn

## Performance

### Automatic Optimizations
- Mobile device detection
- Low-power mode for mobile
- Shadow quality adjustment
- LOD (Level of Detail) system
- Frustum culling

### Manual Settings
- Graphics quality toggle in HUD
- Disable postprocessing on low-end devices

## Integration with Main Portfolio

To integrate Game Mode into the main portfolio:

1. Add a "Game Mode" button to the main navigation
2. Link to `/game` route
3. Optionally add a modal preview
4. Update zone overlays to navigate to actual portfolio sections

## TODO

- [ ] Replace placeholder bike model with actual GLTF
- [ ] Add custom track model
- [ ] Implement project/certificate detail modals
- [ ] Add sound effects and background music
- [ ] Implement lap timing system
- [ ] Add leaderboard (optional)
- [ ] Connect zone overlays to actual portfolio sections
- [ ] Add gamepad support
- [ ] Optimize for VR (optional)

## License

Part of Steven Ortega's portfolio project.
