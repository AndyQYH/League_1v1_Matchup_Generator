"use client"

import type { WinCondition } from "@/lib/win-conditions"
import { cn } from "@/lib/utils"
import { Sword, Castle, Hash, Coins, Clock, Star, Map, Snowflake, Globe } from "lucide-react"

const iconMap: Record<WinCondition["icon"], React.ComponentType<{ className?: string }>> = {
  kill: Sword,
  tower: Castle,
  cs: Hash,
  gold: Coins,
  time: Clock,
  custom: Star,
}

const iconColors: Record<WinCondition["icon"], string> = {
  kill: "text-red-400 bg-red-400/10 border-red-400/30",
  tower: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  cs: "text-teal-400 bg-teal-400/10 border-teal-400/30",
  gold: "text-yellow-300 bg-yellow-300/10 border-yellow-300/30",
  time: "text-violet-400 bg-violet-400/10 border-violet-400/30",
  custom: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
}

const mapChipBase =
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]"

const mapVisuals = {
  rift: {
    label: "Summoner's Rift",
    classes: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    icon: Map,
  },
  aram: {
    label: "Howling Abyss",
    classes: "border-sky-400/40 bg-sky-400/10 text-sky-200",
    icon: Snowflake,
  },
} satisfies Record<WinCondition["maps"][number], { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }>

const totalMapOptions = Object.keys(mapVisuals).length

interface WinConditionCardProps {
  condition: WinCondition | null
  isSpinning: boolean
}

export function WinConditionCard({ condition, isSpinning }: WinConditionCardProps) {
  if (!condition) {
    return (
      <div className="relative w-full max-w-sm">
        <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-6 flex items-center justify-center min-h-[160px] overflow-hidden">
          <div className="absolute inset-0 animate-shimmer" />
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-40"
            >
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
            </svg>
            <p className="text-sm font-sans">Awaiting win condition...</p>
          </div>
        </div>
      </div>
    )
  }

  const Icon = iconMap[condition.icon]
  const colors = iconColors[condition.icon]
  const bgColor = colors.split(" ")[1] // e.g. "bg-red-400/10"
  const borderColor = colors.split(" ")[2] // e.g. "border-red-400/30"
  const textColor = colors.split(" ")[0] // e.g. "text-red-400"

  return (
    <div
      className={cn(
        "relative w-full max-w-sm transition-all duration-500",
        isSpinning && "scale-95 opacity-50"
      )}
    >
      <div
        className={cn(
          "rounded-lg border p-6 min-h-[160px] relative overflow-hidden",
          borderColor,
          bgColor
        )}
      >
        {/* Glow */}
        <div
          className={cn(
            "absolute -top-16 -right-16 w-32 h-32 rounded-full blur-3xl opacity-15",
            textColor.replace("text-", "bg-")
          )}
        />

        {/* Content */}
        <div className="flex items-start gap-3 mb-4 relative">
          <div
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg shrink-0",
              bgColor,
              textColor
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3
              className={cn(
                "font-serif text-lg font-bold tracking-wide",
                textColor
              )}
            >
              {condition.name}
            </h3>
          </div>
        </div>
        <p className="text-sm text-muted-foreground font-sans leading-relaxed relative">
          {condition.description}
        </p>

        <div className="map mt-4 flex flex-wrap gap-2">
          {condition.maps.length === totalMapOptions ? (
            <span
              className={cn(
                mapChipBase,
                "border-muted-foreground/30 bg-muted-foreground/10 text-muted-foreground"
              )}
            >
              <Globe className="w-3.5 h-3.5" />
              All Maps
            </span>
          ) : (
            condition.maps.map((mapId) => {
              const details = mapVisuals[mapId]
              const Icon = details.icon
              return (
                <span key={mapId} className={cn(mapChipBase, details.classes)}>
                  <Icon className="w-3.5 h-3.5" />
                  {details.label}
                </span>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
