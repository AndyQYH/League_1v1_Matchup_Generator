"use client"

import type { GameMap } from "@/lib/effects"
import { cn } from "@/lib/utils"
import { Map, Snowflake, Globe } from "lucide-react"

interface MapSelectorProps {
  selectedMap: GameMap | null
  onSelectMap: (map: GameMap | null) => void
  ruleCount: number
  winConditionCount: number
}

const maps: { id: GameMap | null; label: string; sublabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: null, label: "All Maps", sublabel: "No filter", icon: Globe },
  { id: "rift", label: "Summoner's Rift", sublabel: "Normal", icon: Map },
  { id: "aram", label: "Howling Abyss", sublabel: "ARAM", icon: Snowflake },
]

export function MapSelector({
  selectedMap,
  onSelectMap,
  ruleCount,
  winConditionCount,
}: MapSelectorProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="h-px w-6 bg-border" />
        <span className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">
          Map
        </span>
        <div className="h-px w-6 bg-border" />
      </div>

      <div className="flex items-stretch gap-2">
        {maps.map((m) => {
          const isActive = selectedMap === m.id
          const Icon = m.icon

          return (
            <button
              key={m.id ?? "all"}
              onClick={() => onSelectMap(m.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 rounded-lg border px-3 py-3 transition-all duration-200",
                isActive
                  ? "border-[hsl(var(--primary))]/50 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                  : "border-border bg-card/50 text-muted-foreground hover:border-border hover:bg-card/80 hover:text-foreground"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive && "text-[hsl(var(--primary))]")} />
              <span className="text-xs font-sans font-semibold leading-tight">
                {m.label}
              </span>
              <span className="text-[10px] font-sans opacity-70 leading-tight">
                {m.sublabel}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3">
        <span className="text-[10px] font-sans text-muted-foreground">
          {ruleCount} rules
        </span>
        <span className="text-[10px] font-sans text-muted-foreground">
          {winConditionCount} win conditions
        </span>
      </div>
    </div>
  )
}
