# Aussie Adventure Stylist (Mock Demo)

A polished **mock** Next.js app for hackathon demos. It generates a travel outfit guide inspired by Australian landscapes.
All backend endpoints are mocked, so the app runs **offline** and **needs no API keys**.

https://user-images.githubusercontent.com/—/—/demo.gif (optional demo link)

---

## Why this exists

- Show an end‑to‑end flow: input destination → (optional) upload a photo → extract color palette → combine with wardrobe + weather → output a tidy guide.
- Keep it reliable for a 3‑minute pitch: no external dependencies, consistent results for key locations.

---

## Features

- ⚡ **One‑click Outfit Guide:** enter a destination and generate suggestions instantly.
- 🎨 **Photo‑based palette (mocked):** upload an image and see color chips extracted.
- 🌤️ **Weather badge (mocked):** destination-based temperature + condition.
- 👕 **Wardrobe manager:** add/remove items; the recommender prefers existing items.
- 🗺️ **Preset destinations:** Sydney Harbour, Blue Mountains, Great Ocean Road.
- 🧠 **Story‑style explanations:** each guide includes a short “Why” paragraph.

> Note: All APIs are mocked to avoid latency or key issues during the demo.

---

## Tech Stack

- **Next.js 14 (App Router)**
- **TypeScript + TailwindCSS**
- Minimal in-house UI components (no heavy UI frameworks)
- Mock endpoints under `/app/api`

---

## Quick Start

```bash
npm i
npm run dev
# open http://localhost:3000
```

Build and run production:

```bash
npm run build && npm start
```

Deploy on Vercel:
- Import the repo, select the root directory, framework: **Next.js**.
- No env vars required.

---

## 3‑Minute Demo Script

1. **Hook (10s)**: “We style you to match the landscape.”
2. **Input (30s)**: Type `Blue Mountains`. Optionally upload a scenic photo.
3. **Click Generate (10s)**: See the guide appear with palette chips + weather badge.
4. **Explain (60–90s)**: Walk through recommended items + the “Why” reasoning:
   - UV + breeze → windbreaker + hat
   - Palette echoes eucalyptus greens & sandstone cliffs
   - Items pulled from wardrobe where possible
5. **Close (20s)**: Copy the guide with one click—ready for a packing list or social post.
6. **What’s next (20s)**: “We’d wire real services: weather, vision palette, outfit image export, and itinerary-aware packing.”

---

## API (Mock) Endpoints

### `POST /api/extract-colors`
Returns a random but nature‑like palette, regardless of the image content.
```json
Request: { "imageData": "data:image/png;base64,..." }
Response: { "success": true, "colors": ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5"] }
```

### `GET /api/weather?location=...`
Returns deterministic weather for known keywords; otherwise a sunny fallback.
```json
Response: {
  "main": { "temp": 18, "feels_like": 19, "humidity": 45 },
  "weather": [{ "main": "Sunny", "description": "sunny" }],
  "wind": { "speed": 12 },
  "name": "blue mountains"
}
```

### `POST /api/fashion-advice`
Deterministic guides for **Sydney Harbour**, **Blue Mountains**, **Great Ocean Road**. All other destinations use a generic template.
```json
Request: {
  "destination": "Blue Mountains",
  "seasonStyle": "Autumn Earth",
  "activity": "Hiking",
  "style": "Unisex",
  "wardrobeItems": [{ "id":"1","name":"White T-Shirt","type":"Top","color":"#fff" }],
  "extractedColors": ["#DC143C","#FF6347","#FF7F50","#FFA07A"]
}
Response (truncated): {
  "success": true,
  "advice": {
    "destination": "Blue Mountains",
    "palette": ["#DC143C","#FF6347","#FF7F50","#FFA07A"],
    "items": [ { "name":"White T-Shirt","type":"Top" }, ... ],
    "why": "High UV on the plateau—pack sun protection..."
  }
}
```

---

## Project Structure

```
aussie-adventure-stylist/
├─ app/
│  ├─ api/
│  │  ├─ extract-colors/route.ts      # mocked palette
│  │  ├─ weather/route.ts             # mocked weather
│  │  └─ fashion-advice/route.ts      # destination-aware guide (mock)
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx                        # main UI
├─ components/
│  └─ ui/                             # lightweight UI primitives
├─ public/
│  └─ placeholder.svg
├─ package.json
├─ tailwind.config.js
└─ README.md
```

---

## Environment Variables

None required. All endpoints are mocked.

---

## Limitations

- The color extraction is randomized; it does not analyze the actual image content.
- Weather is heuristic by keyword and not real‑time.
- The app does not persist wardrobe items across reloads.

---

## Roadmap (Post‑Hackathon)

- Real palette extraction (Cloud Vision / Rekognition / ColorThief).
- Real weather + timezone.
- Image export: outfit board via canvas + PNG/PDF.
- Packing list generator based on itinerary length.
- Multi‑region presets beyond Australia.

---

## License

MIT — use freely for demos and experimentation.
