# बारिश — Baarish

*Ek Nazar. Kai Ehsaas. — One rain. Many worlds.*

An interactive digital art experience. A quiet walk through a small North Indian
town on one monsoon evening. The rain is the protagonist; the people reveal what
it means to them. There are no menus, no missions, no interruptions — the visitor
scrolls, and the world moves.

The creative source of truth lives in `.cursor/skills/creative-developer/`
(vision, story, build plan, philosophy). Nothing in this codebase should
contradict those documents.

## Running

```bash
npm install
npm run dev
```

Open http://localhost:3000, put on headphones, and walk slowly.

## The journey

One continuous street along −z. Scroll progress (0 → 1) drives a hand-authored
camera curve. The world clock never stops — rain, steam, flicker and breathing
continue even when the visitor does not move.

| Progress | Place | Emotion |
| --- | --- | --- |
| 0.00–0.10 | Arrival | Curiosity |
| ~0.15 | Ghar (the family window) | Warmth |
| ~0.30 | Gali (children, puddles, the window child) | Joy / longing |
| ~0.47 | Bus stop | Empathy |
| ~0.60 | Chai tapri | Community |
| ~0.78 | Open road | Solitude |
| ~0.90 | Office window | Acceptance |
| 1.00 | Departure | The rain continues |

Camera and gaze curves, scene ranges and captions are all defined in
`lib/journey.ts` — that file is the film's edit.

## Architecture

- **Two clocks, strictly separated.** Scroll progress moves only the camera,
  captions and the darkening sky. Everything alive (rain, steam, ripples, people
  breathing, the paper boat) runs on the render clock so the world never freezes.
- `components/canvas/atmosphere/` — sky shader, GPU-instanced rain volume,
  lightning, global fog/exposure control.
- `components/canvas/world/` — the town: generated houses (deterministic seeds —
  the same town every visit), lamps, poles, sagging wires, and the six authored
  scenes in `world/scenes/`.
- `components/canvas/life/` — steam, puddle ripples, the paper boat, silhouettes,
  the sleeping dog, hanging clothes.
- `components/dom/` — the intro, whispered captions, sound toggle. The only UI.
- `lib/audio/rainEngine.ts` — procedural monsoon audio (filtered noise layers,
  slow LFO drift, randomized distant thunder). Nothing loops audibly.

People are rendered as soft backlit silhouettes on purpose: this world is a
memory, and memory blurs faces.

## Dev tools

- `http://localhost:3000/?peek=0.6` — skip the intro and jump to any journey
  point (used for framing and screenshots).
- `node scripts/shoot.mjs 0.15,0.6` — headless screenshot pass across the
  journey (requires chromium).

## Stack

Next.js 15 · TypeScript · React Three Fiber · drei · GSAP · Lenis · Zustand ·
Tailwind CSS · Web Audio
