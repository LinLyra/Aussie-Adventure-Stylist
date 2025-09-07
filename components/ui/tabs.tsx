"use client"
import * as React from "react"
import { cn } from "../../utils"

type Ctx = { value: string; setValue: (v: string) => void }
const TabsContext = React.createContext<Ctx | null>(null)

export function Tabs({ defaultValue, className, children }: { defaultValue: string; className?: string; children: React.ReactNode }) {
  const [value, setValue] = React.useState(defaultValue)
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("grid grid-cols-3 gap-2 bg-card/40 rounded-lg p-1", className)}>{children}</div>
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!
  const active = ctx.value === value
  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn("px-4 py-2 rounded-md text-sm", active ? "bg-primary text-black" : "hover:bg-card/40")}
    >
      {children}
    </button>
  )
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(TabsContext)!
  if (ctx.value !== value) return null
  return <div className={cn("mt-6", className)}>{children}</div>
}
