# Cloud Dash — Race Above the Clouds

**English** | [Tiếng Việt](README.vi.md)

Created with **GPT 6-Astra** using **medium reasoning**.

## Development report

Read the [detailed development report](REPORT.md) for the user prompts, implementation history, timeline, costs, and testing. A [Vietnamese report](REPORT.vi.md) is also available. The report distinguishes verified results from unmeasured performance and unavailable billing data.

## One-step launch

**Double-click `index.html` to play in Chrome, Edge, or Firefox.** No installation, npm, server, or Internet connection is required. Extract the ZIP first if applicable.

The game interface is in Vietnamese; this English documentation explains the controls and menu labels.

## Controls

- **WASD / arrow keys:** move; W / ↑ moves toward the finish.
- **Space:** jump over gaps or rotating bars.
- **Esc / Ⅱ:** pause or resume.
- **♪:** toggle synthesized audio.
- Touch devices have directional buttons and a jump button.

Choose a course and finish within its time limit against 11 bots. Dodge gates and jump over rotating bars and gaps. Falling respawns you at the latest checkpoint. Green lines activate checkpoints. Personal bests are stored locally when the browser permits localStorage.

## Source files

| File | Purpose |
| --- | --- |
| `index.html` | Vietnamese game interface |
| `style.css` | Responsive plain CSS, without build tools |
| `game.js` | 3D scene, AI, physics, controls, game states, and audio |
| `obstacles.js` | Additional obstacle mechanics, animation, and collision |
| `verify.cjs` | Logic checks using Node.js |
| `README.md` / `README.vi.md` | English / Vietnamese instructions |
| `REPORT.md` / `REPORT.vi.md` | English / Vietnamese development reports |
| `vendor/three.min.js` | Bundled Three.js r160 |
| `vendor/LICENSE.txt` | Three.js MIT license |

Visuals are generated from geometry in code; no external assets are fetched during play. This original obstacle racer uses no Fall Guys assets. It is a solo game with bots, not online multiplayer.

Physics uses a fixed 120 Hz step. Rendering uses requestAnimationFrame, a pixel ratio capped at 1.6, and shared materials. The target is 60fps on hardware-accelerated WebGL devices; actual performance depends on the device and has not been benchmarked. The game pauses when switching tabs. The interface uses plain CSS without requiring Tailwind.

For optional HTTP-based development, run `python -m http.server 8080` in this directory and open [localhost:8080](http://localhost:8080).

## Three courses

| Course | Length | Time limit | Islands | Gates / rotating bars |
| --- | ---: | ---: | ---: | ---: |
| Skyline Circuit | 132 m | 120 seconds | 4 | 2 / 1 |
| Sunset Marathon | 300 m | 210 seconds | 6 | 2 / 2 |
| Aurora Expedition | 480 m | 300 seconds | 10 | 1 / 5 |

Use **CHỌN ĐƯỜNG ĐUA** (Choose course) in the lobby. Each course has its own colors, obstacle layout, and personal best. A checkpoint follows every gap. Restarting keeps the selected course; use **Về sảnh** (Back to lobby) to switch. **VÀO ĐƯỜNG ĐUA** starts a race; **TIẾP TỤC** resumes it.

Run `node verify.cjs` to check controls, jumps across every gap, respawning, finishing, timeouts, and bot completion on all three courses.

## Obstacle variety (v2)

- **Orange swinging hammers:** the head knocks racers away. Dodge sideways or wait for the upswing.
- **Red pushers:** extend from the edge, pushing sideways or blocking the path. Switch lanes or jump over them.
- **Blue conveyors:** moving stripes show the forward/backward pull direction. Jump to escape their force.
- **Mint jump pads with a plus sign:** touching one while grounded launches you upward. You can still steer in the air.
- **Sliding gates and rotating bars:** combined differently with the four new mechanics on each course.

`obstacles.js` implements geometry, animation, collision, and bot avoidance. Players and bots experience the same physical effects. Version 2 records use separate storage keys; old records are preserved but are not compared against the changed courses.
