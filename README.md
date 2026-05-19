# 🔭 NightShift Observatory

A futuristic personal observatory control system for amateur astronomers and astrophotographers. Plan nightly observation sessions, visualize the celestial sphere in 3D, track targets, and log your observations.

![NightShift Observatory](https://img.shields.io/badge/NightShift-Observatory-00d4ff?style=flat-square)
![Version](https://img.shields.io/badge/version-2.4.1-00ffcc?style=flat-square)
![Tech](https://img.shields.io/badge/React%20%2B%20Three.js-TypeScript-8b5cf6?style=flat-square)

---

## ✨ Features

- **3D Sky Dome** — Interactive WebGL star field with 75+ celestial objects rendered as clickable markers
- **Observation Planner** — Filter and sort objects by type, visibility score, difficulty, and search by name
- **Target Focus Mode** — Click any object for detailed stats, radar chart profile, and observer notes
- **Target Locking** — Lock your telescope on a target with visual HUD indicators
- **Time Simulation** — Scrub through nighttime hours; object visibility updates in real-time
- **Session Logging** — Save observation sessions with targets, notes, conditions, and location (localStorage)
- **Atmospheric Conditions** — Live-style panel showing seeing, transparency, humidity, Bortle rating
- **Equipment Profile** — Telescope, eyepiece, mount, camera, and filter configuration panel

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── scenes/
│   │   └── SkyScene.tsx          # Three.js 3D sky dome, star field, object markers
│   ├── ui/
│   │   ├── Header.tsx            # Top bar — branding, time, system status
│   │   ├── LeftSidebar.tsx       # Panel container (planner / target / log tabs)
│   │   ├── PlannerPanel.tsx      # Filtered object list with visibility scores
│   │   ├── TargetPanel.tsx       # Selected object details + radar chart
│   │   ├── SessionLogPanel.tsx   # Save/view observation sessions
│   │   ├── RightPanel.tsx        # Conditions, stats, highlights, equipment
│   │   └── BottomBar.tsx         # Time slider and quick visibility strip
│   └── overlays/
│       └── HUDOverlay.tsx        # Scanline, crosshair, hover tooltip
├── systems/
│   └── store.ts                  # Zustand global state store
├── data/
│   └── celestialObjects.ts       # 75+ mock celestial objects dataset
├── utils/
│   └── helpers.ts                # Time formatting, color utils, visibility math
├── App.tsx                       # Root layout — Canvas + UI layers
├── main.tsx                      # React entry point
└── index.css                     # Tailwind + custom design tokens
```

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--void` | `#030508` | App background |
| `--cosmos` | `#070c14` | Panel backgrounds |
| `--nebula` | `#0d1829` | Secondary surfaces |
| `--neon-blue` | `#00d4ff` | Primary accent |
| `--neon-cyan` | `#00ffcc` | Success / good visibility |
| `--neon-purple` | `#8b5cf6` | Locked target indicator |
| `--neon-violet` | `#c084fc` | Locked state text |

**Fonts:**
- Display: `Orbitron` — headers, stats, labels
- Body: `Exo 2` — object names, descriptions
- Mono: `Share Tech Mono` — data readouts, coordinates

---

## 🌌 Celestial Dataset

The mock dataset includes **75+ objects** across 6 categories:

| Type | Count | Color |
|------|-------|-------|
| Stars | 20+ | `#00d4ff` Blue |
| Planets | 10 | `#00ffcc` Cyan |
| Nebulae | 7 | `#ff9944` Orange |
| Galaxies | 5 | `#c084fc` Purple |
| Clusters | 5 | `#fbbf24` Amber |
| Satellites | 2 | `#ffffff` White |

Each object includes: name, type, 3D position, brightness, visibility score, best viewing time, difficulty, description, observer notes, constellation, and apparent magnitude.

---

## 🎮 Controls

| Action | Control |
|--------|---------|
| Orbit camera | Left-click drag |
| Zoom | Scroll wheel |
| Select object | Click on marker |
| Back to planner | "Back" button in target panel |
| Lock target | "Lock Target" button in target panel |
| Play time simulation | Play button (header or bottom bar) |
| Scrub time | Bottom bar slider |
| Filter objects | Type buttons + visibility slider |

---

## 🛠 Tech Stack

- **Vite** — Build tool & dev server
- **React 18** — UI framework
- **TypeScript** — Type safety
- **Three.js** — 3D WebGL engine
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — Three.js helpers (OrbitControls, Stars)
- **Zustand** — Lightweight state management (with localStorage persistence for sessions)
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — UI animations and transitions
- **Recharts** — Radar chart and bar chart for analytics panels

---

## 📈 Extending the Project

### Add Real Sky Data
Replace `src/data/celestialObjects.ts` with live data from:
- [Stellarium Web Engine API](https://github.com/Stellarium/stellarium-web-engine)
- [NASA Horizons API](https://ssd.jpl.nasa.gov/horizons/)
- [AstroPy](https://www.astropy.org/) (Python backend)

### Add Real Telescope Control
Integrate with [INDI Protocol](https://indilib.org/) or [ASCOM Platform](https://ascom-standards.org/) via a WebSocket bridge.

### Add Astrophotography Planning
Integrate [Astrometry.net](http://nova.astrometry.net/) for plate solving and framing overlays.

---

## 📄 License

MIT — built as a portfolio prototype. Fork freely.

---

*"The universe is under no obligation to make sense to you."* — Neil deGrasse Tyson
