import { NextResponse, type NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json().catch(() => ({}))
    const palettes = [
      ["#FF6B35", "#F7931E", "#FFD23F", "#06FFA5"],
      ["#2E8B57", "#228B22", "#32CD32", "#90EE90"],
      ["#4682B4", "#87CEEB", "#B0E0E6", "#F0F8FF"],
      ["#D2691E", "#CD853F", "#DEB887", "#F5DEB3"],
      ["#DC143C", "#FF6347", "#FF7F50", "#FFA07A"]
    ]
    const colors = palettes[Math.floor(Math.random() * palettes.length)]
    return NextResponse.json({ success: true, colors })
  } catch (err) {
    return NextResponse.json(
      { success: false, colors: ["#E6B800", "#8B4513", "#228B22", "#87CEEB"], error: "fallback" },
      { status: 200 }
    )
  }
}
