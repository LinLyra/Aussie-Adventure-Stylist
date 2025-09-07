import { NextResponse } from "next/server"

const presets: Record<string, { temp: number; main: string; wind: number; humidity: number }> = {
  sydney: { temp: 25, main: "Partly Cloudy", wind: 12, humidity: 58 },
  blue: { temp: 18, main: "Sunny", wind: 14, humidity: 45 },
  ocean: { temp: 20, main: "Windy", wind: 22, humidity: 70 },
  uluru: { temp: 33, main: "Hot", wind: 10, humidity: 20 },
  daintree: { temp: 26, main: "Humid", wind: 8, humidity: 85 },
  bondi: { temp: 24, main: "Breezy", wind: 18, humidity: 65 }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get("location") || "").toLowerCase()

  const key = Object.keys(presets).find(k => q.includes(k))
  const p = key ? presets[key] : { temp: 22, main: "Sunny", wind: 10, humidity: 60 }

  return NextResponse.json({
    main: { temp: p.temp, feels_like: p.temp + 1, humidity: p.humidity },
    weather: [{ main: p.main, description: p.main.toLowerCase() }],
    wind: { speed: p.wind },
    name: q || "Unknown"
  })
}
