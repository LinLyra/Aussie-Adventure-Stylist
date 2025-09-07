"use client"

import { useEffect, useState } from "react"
import {
  MapPin,
  Palette,
  Sun,
  Cloud,
  Snowflake,
  Leaf,
  Upload,
  Camera,
  Shirt,
  Plus,
  Trash2,
  Mountain,
  Waves,
  TreePine,
  Compass,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type WardrobeItem = { id: string; name: string; type: string; color: string; image?: string }

const australianSeasons = [
  { id: "summer", name: "Summer Vibes", description: "Bright, vibrant colors for hot summers", icon: <Sun className="w-4 h-4" />, colors: ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A"] },
  { id: "autumn", name: "Autumn Earth", description: "Warm earth tones for mild autumns", icon: <Leaf className="w-4 h-4" />, colors: ["#D2691E", "#CD853F", "#DAA520", "#B22222"] },
  { id: "winter", name: "Winter Blues", description: "Cool, sophisticated colors for mild winters", icon: <Snowflake className="w-4 h-4" />, colors: ["#2F4F4F", "#708090", "#F5F5F5", "#4682B4"] },
  { id: "spring", name: "Spring Fresh", description: "Fresh, light colors for blooming spring", icon: <TreePine className="w-4 h-4" />, colors: ["#90EE90", "#FFB6C1", "#87CEEB", "#F0E68C"] },
]

const popularDestinations = [
  { name: "Sydney Harbour", type: "Urban Coastal", icon: <Waves className="w-4 h-4" /> },
  { name: "Blue Mountains", type: "Mountain", icon: <Mountain className="w-4 h-4" /> },
  { name: "Great Ocean Road", type: "Coastal Drive", icon: <Compass className="w-4 h-4" /> },
  { name: "Uluru", type: "Desert", icon: <Sun className="w-4 h-4" /> },
  { name: "Daintree Rainforest", type: "Tropical", icon: <TreePine className="w-4 h-4" /> },
  { name: "Bondi Beach", type: "Beach", icon: <Waves className="w-4 h-4" /> },
]

const destinationImages: Record<string, string> = {
  "Sydney Harbour": "https://images.unsplash.com/photo-1506976785307-8732e854ad75?q=80&w=1600&auto=format&fit=crop",
  "Blue Mountains": "https://images.unsplash.com/photo-1565071786210-b24b1df9327e?q=80&w=1600&auto=format&fit=crop",
  "Great Ocean Road": "https://images.unsplash.com/photo-1526485797140-6f5d8d7b90f9?q=80&w=1600&auto=format&fit=crop",
  Uluru: "https://images.unsplash.com/photo-1568872327745-79fba3991099?q=80&w=1600&auto=format&fit=crop",
  "Daintree Rainforest": "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=1600&auto=format&fit=crop",
  "Bondi Beach": "https://images.unsplash.com/photo-1540202404-cdd4a6d5d63b?q=80&w=1600&auto=format&fit=crop",
}

function formatAdviceToText(
  advice: any,
  opts?: { currentTime?: string; weatherBadge?: string; includePaletteLine?: boolean }
) {
  const lines: string[] = []
  lines.push("🌏 AUSTRALIAN TRAVEL OUTFIT GUIDE", "")
  if (advice?.destination) lines.push(`📍 Destination: ${advice.destination}`)
  if (opts?.currentTime) lines.push(`🕐 Current Time: ${opts.currentTime}`)
  if (opts?.weatherBadge) lines.push(`🌤️ Weather: ${opts.weatherBadge}`)
  lines.push("")
  if (opts?.includePaletteLine && Array.isArray(advice?.palette) && advice.palette.length) {
    lines.push(`🎨 Palette: ${advice.palette.join(", ")}`, "")
  }
  lines.push("✅ RECOMMENDED OUTFIT")
  if (Array.isArray(advice?.items)) {
    advice.items.forEach((it: any) => lines.push(`• ${it.name} (${it.type})`))
  }
  lines.push("")
  if (advice?.why) {
    lines.push("🧠 Why")
    lines.push(advice.why)
  }
  if (advice?.sustainability?.note) {
    lines.push("", `Note: ${advice.sustainability.note}`)
  }
  return lines.join("\\n")
}

export default function Page() {
  const [location, setLocation] = useState("")
  const [selectedStyle, setSelectedStyle] = useState(australianSeasons[1])
  const [outfitAdvice, setOutfitAdvice] = useState("")
  const [advicePalette, setAdvicePalette] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [weatherInfo, setWeatherInfo] = useState("")
  const [activityType, setActivityType] = useState("")
  const [gender, setGender] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [extractedColors, setExtractedColors] = useState<string[]>([])
  const [currentTime, setCurrentTime] = useState("")
  const [realWeatherData, setRealWeatherData] = useState<any>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState(false)

  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([
    { id: "1", name: "White T-Shirt", type: "Top", color: "#FFFFFF" },
    { id: "2", name: "Blue Jeans", type: "Bottom", color: "#4169E1" },
    { id: "3", name: "Hiking Boots", type: "Shoes", color: "#8B4513" },
    { id: "5", name: "Cargo Shorts", type: "Bottom", color: "#F5DEB3" },
    { id: "6", name: "Sun Hat", type: "Accessory", color: "#DEB887" }
  ])
  const [newItem, setNewItem] = useState({ name: "", type: "", color: "#000000" })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const imageUrl = ev.target?.result as string
      setUploadedImage(imageUrl)
      try {
        const res = await fetch("/api/extract-colors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageData: imageUrl }),
        })
        const data = await res.json()
        setExtractedColors(data.colors || [])
      } catch {
        setExtractedColors(["#E6B800", "#8B4513", "#228B22", "#87CEEB"])
      }
    }
    reader.readAsDataURL(file)
  }

  const addWardrobeItem = () => {
    if (newItem.name && newItem.type) {
      setWardrobeItems((w) => [...w, { ...newItem, id: String(Date.now()) }])
      setNewItem({ name: "", type: "", color: "#000000" })
    }
  }
  const removeWardrobeItem = (id: string) => setWardrobeItems((w) => w.filter((i) => i.id !== id))

  const fetchRealWeather = async (locationName: string) => {
    setIsLoadingWeather(true)
    try {
      const response = await fetch(`/api/weather?location=${encodeURIComponent(locationName)}`)
      const weatherData = await response.json()
      setRealWeatherData(weatherData)
      return weatherData
    } catch {
      const fallback = {
        main: { temp: 22, feels_like: 24, humidity: 60 },
        weather: [{ main: "Sunny", description: "clear sky" }],
        wind: { speed: 10 },
        name: locationName,
      }
      setRealWeatherData(fallback)
      return fallback
    } finally {
      setIsLoadingWeather(false)
    }
  }

  const generateOutfitAdvice = async () => {
    if (!location.trim()) return
    setIsGenerating(true)
    try {
      const weather = await fetchRealWeather(location)
      const weatherBadge = `${weather.main.temp}°C, ${weather.weather[0].main}`
      setWeatherInfo(weatherBadge)

      const res = await fetch("/api/fashion-advice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: location,
          seasonStyle: selectedStyle.name,
          activity: activityType || "Hiking",
          style: gender || "Unisex",
          wardrobeItems,
          extractedColors
        }),
      })
      const data = await res.json()

      if (data?.success && data?.advice) {
        const apiPalette: string[] = Array.isArray(data.advice?.palette) ? data.advice.palette.slice(0, 5) : []
        const displayPalette = extractedColors.length ? extractedColors.slice(0, 5) : apiPalette
        setAdvicePalette(displayPalette)

        const text = formatAdviceToText(data.advice, {
          currentTime,
          weatherBadge,
          includePaletteLine: displayPalette.length === 0
        })
        setOutfitAdvice(text)
      } else {
        setAdvicePalette([])
        setOutfitAdvice("Unable to generate advice right now.")
      }
    } catch {
      setAdvicePalette([])
      setOutfitAdvice("Unable to generate advice right now.")
    } finally {
      setIsGenerating(false)
    }
  }

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleString("en-AU", {
          timeZone: "Australia/Sydney",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    }
    tick()
    const i = setInterval(tick, 60_000)
    return () => clearInterval(i)
  }, [])

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/10 via-blue-50/10 to-green-50/10" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Aussie Adventure Stylist</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Discover outfit colors inspired by Australia's natural landscapes. Dress in harmony with your destination.
          </p>
          {currentTime && <p className="text-sm text-white/60 mt-2">🕐 {currentTime}</p>}
        </div>

        <Tabs defaultValue="planner" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="planner">Trip Planner</TabsTrigger>
            <TabsTrigger value="wardrobe">My Wardrobe</TabsTrigger>
            <TabsTrigger value="destinations">Destinations</TabsTrigger>
          </TabsList>

          <TabsContent value="planner" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Trip Details
                  </CardTitle>
                  <CardDescription>Plan your Australian adventure outfit</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="location">Destination</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Sydney Harbour, Blue Mountains, Great Ocean Road..."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Destination Photo (Optional)</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-4">
                      {uploadedImage ? (
                        <div className="space-y-2">
                          <img src={uploadedImage} alt="Destination" className="w-full h-40 object-cover rounded" />
                          {extractedColors.length > 0 && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm text-white/60">Extracted colors:</span>
                              {extractedColors.map((c, i) => (
                                <span key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center">
                          <Camera className="w-8 h-8 mx-auto mb-2 text-white/50" />
                          <p className="text-sm text-white/60 mb-2">Upload a photo to extract colors</p>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="image-upload" />
                          <Button variant="outline" size="sm" asChild>
                            <label htmlFor="image-upload" className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose Photo
                            </label>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Activity Type</Label>
                      <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                        className="w-full rounded-md bg-input border border-border px-3 py-2"
                      >
                        <option value="" disabled>Select activity</option>
                        <option value="beach">Beach Day</option>
                        <option value="hiking">Hiking / Bushwalking</option>
                        <option value="city">City Exploration</option>
                        <option value="adventure">Adventure Sports</option>
                        <option value="wildlife">Wildlife Watching</option>
                        <option value="photography">Photography Tour</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Style Preference</Label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full rounded-md bg-input border border-border px-3 py-2"
                      >
                        <option value="" disabled>Select style</option>
                        <option value="male">Masculine</option>
                        <option value="female">Feminine</option>
                        <option value="unisex">Unisex</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Choose Season Style</Label>
                    <div className="grid grid-cols-2 gap-3">
                      {australianSeasons.map((style) => (
                        <Card
                          key={style.id}
                          className={`cursor-pointer transition-all hover:scale-105 ${selectedStyle.id === style.id ? "ring-2 ring-primary bg-card/60" : "hover:bg-card/40"}`}
                          onClick={() => setSelectedStyle(style)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              {style.icon}
                              <span className="font-medium text-sm">{style.name}</span>
                            </div>
                            <p className="text-xs text-white/70 mb-2">{style.description}</p>
                            <div className="flex gap-1">
                              {style.colors.map((c, i) => (
                                <span key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateOutfitAdvice}
                    disabled={!location.trim() || isGenerating || isLoadingWeather}
                    className="w-full"
                    size="lg"
                  >
                    {isGenerating || isLoadingWeather ? (
                      <>
                        <Palette className="w-4 h-4 mr-2 animate-spin" />
                        {isLoadingWeather ? "Getting Weather..." : "Analyzing Colors..."}
                      </>
                    ) : (
                      <>
                        <Palette className="w-4 h-4 mr-2" />
                        Generate Outfit Guide
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    Your Outfit Guide
                  </CardTitle>
                  <CardDescription>Personalized styling advice for your Australian adventure</CardDescription>
                </CardHeader>
                <CardContent>
                  {outfitAdvice ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="bg-primary/20 text-primary">
                          {selectedStyle.name}
                        </Badge>
                        {realWeatherData && (
                          <Badge variant="outline" className="text-xs">
                            <Cloud className="w-3 h-3 mr-1" />
                            Live: {realWeatherData.main.temp}°C, {realWeatherData.weather[0].main}
                          </Badge>
                        )}
                      </div>

                      {advicePalette.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-white/60">Palette:</span>
                          {advicePalette.map((c, i) => (
                            <span key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                          ))}
                        </div>
                      )}

                      <Textarea value={outfitAdvice} onChange={(e) => setOutfitAdvice(e.target.value)} className="min-h-[380px]" />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(outfitAdvice)}>
                          Copy Guide
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => { setOutfitAdvice(""); setAdvicePalette([]) }}>
                          Clear
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[380px] text-white/60">
                      <div className="text-center">
                        <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Enter your destination and preferences to get your personalized outfit guide</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="wardrobe" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-primary" />
                  My Wardrobe
                </CardTitle>
                <CardDescription>Manage your clothing items for personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input placeholder="Item name" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
                  <select value={newItem.type} onChange={(e) => setNewItem({ ...newItem, type: e.target.value })} className="rounded-md bg-input border border-border px-3 py-2">
                    <option value="" disabled>Type</option>
                    <option value="Top">Top</option>
                    <option value="Bottom">Bottom</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessory">Accessory</option>
                    <option value="Outerwear">Outerwear</option>
                  </select>
                  <input type="color" value={newItem.color} onChange={(e) => setNewItem({ ...newItem, color: e.target.value })} className="w-full h-10 rounded border border-border bg-input" />
                  <Button onClick={addWardrobeItem}><Plus className="w-4 h-4 mr-2" />Add Item</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {wardrobeItems.map((item) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-sm text-white/60">{item.type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeWardrobeItem(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="destinations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary" />
                  Popular Australian Destinations
                </CardTitle>
                <CardDescription>Discover outfit inspiration for iconic Australian locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {popularDestinations.map((dest) => (
                    <Card key={dest.name} className="cursor-pointer hover:bg-card/60 transition-colors overflow-hidden" onClick={() => setLocation(dest.name)}>
                      <div className="aspect-video relative">
                        <img src={destinationImages[dest.name] || "/placeholder.svg"} alt={dest.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20" />
                        <div className="absolute bottom-2 left-2 text-white">
                          <p className="font-medium text-sm">{dest.name}</p>
                          <p className="text-xs opacity-90">{dest.type}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12 text-white/60">
          <p className="text-sm">Inspired by Australia's diverse landscapes • Color harmony with nature • Adventure-ready styling</p>
        </div>
      </div>
    </div>
  )
}
