import { NextResponse, type NextRequest } from "next/server"

type WardrobeItem = { id: string; name: string; type: string; color: string }

function pickByKeyword(wardrobe: WardrobeItem[], keyword: string, fallback: WardrobeItem) {
  const found = wardrobe.find(w => w.name.toLowerCase().includes(keyword))
  return found ?? fallback
}

function guideForSydney(wardrobe: WardrobeItem[], extracted?: string[]) {
  const items = [
    pickByKeyword(wardrobe, "t-shirt", { id: "x", name: "White T-Shirt", type: "Top", color: "#fff" }),
    pickByKeyword(wardrobe, "jeans", { id: "x", name: "Blue Jeans", type: "Bottom", color: "#4169E1" }),
    pickByKeyword(wardrobe, "sneaker", { id: "x", name: "White Canvas Shoes", type: "Shoes", color: "#eee" }),
    pickByKeyword(wardrobe, "hat", { id: "x", name: "Sun Hat", type: "Accessory", color: "#DEB887" })
  ]

  return {
    destination: "Sydney Harbour",
    palette: extracted?.length ? extracted.slice(0, 5) : ["#1F4C73", "#E6B800", "#9EC6D8"],
    items,
    why: "Sea breeze near the harbour can be cool; light layers and comfortable shoes are ideal. Blues and neutrals echo the water and skyline."
  }
}

function guideForBlueMountains(wardrobe: WardrobeItem[], extracted?: string[]) {
  const items = [
    pickByKeyword(wardrobe, "t-shirt", { id: "x", name: "White T-Shirt", type: "Top", color: "#fff" }),
    pickByKeyword(wardrobe, "cargo", { id: "x", name: "Cargo Shorts", type: "Bottom", color: "#F5DEB3" }),
    pickByKeyword(wardrobe, "boot", { id: "x", name: "Hiking Boots", type: "Shoes", color: "#8B4513" }),
    pickByKeyword(wardrobe, "hat", { id: "x", name: "Sun Hat", type: "Accessory", color: "#DEB887" }),
    { id: "x", name: "Windbreaker Jacket", type: "Outerwear", color: "#999" }
  ]

  return {
    destination: "Blue Mountains",
    palette: extracted?.length ? extracted.slice(0, 5) : ["#DC143C", "#FF6347", "#FF7F50", "#FFA07A"],
    items,
    why: "High UV on the plateau—pack sun protection. Lookouts are breezy; bring a light windproof layer. Palette reflects eucalyptus greens and sandstone cliffs."
  }
}

function guideForGreatOceanRoad(wardrobe: WardrobeItem[], extracted?: string[]) {
  const items = [
    pickByKeyword(wardrobe, "t-shirt", { id: "x", name: "White T-Shirt", type: "Top", color: "#fff" }),
    pickByKeyword(wardrobe, "jeans", { id: "x", name: "Blue Jeans", type: "Bottom", color: "#4169E1" }),
    pickByKeyword(wardrobe, "boot", { id: "x", name: "Hiking Boots", type: "Shoes", color: "#8B4513" }),
    { id: "x", name: "Light Rain Jacket", type: "Outerwear", color: "#a0c" }
  ]

  return {
    destination: "Great Ocean Road",
    palette: extracted?.length ? extracted.slice(0, 5) : ["#0F6BA8", "#87CEEB", "#C2E0F2"],
    items,
    why: "Coastal winds can change quickly; sturdy shoes and a light rain jacket are useful. Palette mirrors the Southern Ocean and cliffs."
  }
}

function genericGuide(dest: string, wardrobe: WardrobeItem[], extracted?: string[]) {
  const items = [
    pickByKeyword(wardrobe, "t-shirt", { id: "x", name: "White T-Shirt", type: "Top", color: "#fff" }),
    pickByKeyword(wardrobe, "short", { id: "x", name: "Cargo Shorts", type: "Bottom", color: "#F5DEB3" }),
    pickByKeyword(wardrobe, "boot", { id: "x", name: "Hiking Boots", type: "Shoes", color: "#8B4513" }),
    pickByKeyword(wardrobe, "hat", { id: "x", name: "Sun Hat", type: "Accessory", color: "#DEB887" })
  ]
  return {
    destination: dest,
    palette: extracted?.length ? extracted.slice(0, 5) : ["#E6B800", "#8B4513", "#228B22", "#87CEEB"],
    items,
    why: "General travel outfit tuned for Australian conditions: breathable fabrics, sun protection, and comfortable walking shoes."
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const destRaw: string = body.destination || body.location || "Your Destination"
    const wardrobe: WardrobeItem[] = Array.isArray(body.wardrobeItems) ? body.wardrobeItems : []
    const extracted: string[] | undefined = Array.isArray(body.extractedColors) ? body.extractedColors : undefined

    const d = destRaw.toLowerCase()
    let advice
    if (d.includes("sydney")) advice = guideForSydney(wardrobe, extracted)
    else if (d.includes("blue")) advice = guideForBlueMountains(wardrobe, extracted)
    else if (d.includes("ocean")) advice = guideForGreatOceanRoad(wardrobe, extracted)
    else advice = genericGuide(destRaw, wardrobe, extracted)

    return NextResponse.json({
      success: true,
      advice: {
        ...advice,
        sustainability: { note: "All items selected from your wardrobe where possible." }
      }
    })
  } catch (e) {
    return NextResponse.json(
      { success: false, advice: { destination: "Unknown", items: [], palette: [], why: "Service unavailable." } },
      { status: 200 }
    )
  }
}
