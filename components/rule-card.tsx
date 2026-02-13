"use client"

import type { GameMap, Rule } from "@/lib/effects"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Flame,
  Swords,
  Zap,
  Shield,
  Coins,
  Map,
  Snowflake,
  Globe,
} from "lucide-react"

const categoryConfig: Record<
  string,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  "summoner-spells": {
    label: "Summoner Spell",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    icon: Flame,
  },
  items: {
    label: "Item Restriction",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
    icon: Swords,
  },
  skills: {
    label: "Skill Restriction",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
    borderColor: "border-rose-400/30",
    icon: Zap,
  },
  champion: {
    label: "Champion Rule",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
    icon: Shield,
  },
  economy: {
    label: "Economy Rule",
    color: "text-yellow-300",
    bgColor: "bg-yellow-300/10",
    borderColor: "border-yellow-300/30",
    icon: Coins,
  },
}

const mapChipBase =
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]"

const mapVisuals: Record<
  GameMap,
  { label: string; classes: string; icon: React.ComponentType<{ className?: string }> }
> = {
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
}

const totalMapOptions = Object.keys(mapVisuals).length

interface RuleCardProps {
  rule: Rule | null
  isSpinning: boolean
}

export function RuleCard({ rule, isSpinning }: RuleCardProps) {
  if (!rule) {
    return (
      <div className="relative w-full max-w-sm">
        <div className="rounded-lg border-2 border-dashed border-border bg-card/50 p-6 flex items-center justify-center min-h-[180px] overflow-hidden">
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
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <p className="text-sm font-sans">Awaiting rule...</p>
          </div>
        </div>
      </div>
    )
  }

  const config = categoryConfig[rule.categoryId] ?? categoryConfig["champion"]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "relative w-full max-w-sm transition-all duration-500",
        isSpinning && "scale-95 opacity-50"
      )}
    >
      <div
        className={cn(
          "rounded-lg border p-6 min-h-[180px] relative overflow-hidden",
          config.borderColor,
          config.bgColor
        )}
      >
        {/* Glow effect */}
        <div
          className={cn(
            "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-15",
            config.color.replace("text-", "bg-")
          )}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4 relative">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                config.bgColor,
                config.color
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3
                className={cn(
                  "font-serif text-lg font-bold tracking-wide",
                  config.color
                )}
              >
                {rule.name}
              </h3>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-sans uppercase tracking-wider shrink-0",
              config.borderColor,
              config.color,
              config.bgColor
            )}
          >
            {config.label}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground font-sans leading-relaxed relative">
          {rule.description}
        </p>

        <div className="map mt-4 flex flex-wrap gap-2">
          {rule.maps.length === totalMapOptions ? (
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
            rule.maps.map((mapId) => {
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
