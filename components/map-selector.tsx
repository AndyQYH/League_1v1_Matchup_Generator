"use client"

import type { GameMap } from "@/lib/effects"
import { cn } from "@/lib/utils"
import { Map, Snowflake, Globe } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface MapSelectorProps {
  selectedMap: GameMap | null
  onSelectMap: (map: GameMap | null) => void
  ruleCount: number
  winConditionCount: number
}

const maps = [
  {
    id: null as GameMap | null,
    labelKey: "mapSelector.maps.all.name" as const,
    sublabelKey: "mapSelector.maps.all.sublabel" as const,
    icon: Globe,
  },
  {
    id: "rift" as const,
    labelKey: "mapSelector.maps.rift.name" as const,
    sublabelKey: "mapSelector.maps.rift.sublabel" as const,
    icon: Map,
  },
  {
    id: "aram" as const,
    labelKey: "mapSelector.maps.aram.name" as const,
    sublabelKey: "mapSelector.maps.aram.sublabel" as const,
    icon: Snowflake,
  },
]

export function MapSelector({
  selectedMap,
  onSelectMap,
  ruleCount,
  winConditionCount,
}: MapSelectorProps) {
  const { t } = useLanguage()

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="h-px w-6 bg-border" />
        <span className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">
          {t("mapSelector.label")}
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
                {t(m.labelKey)}
              </span>
              <span className="text-[10px] font-sans opacity-70 leading-tight">
                {t(m.sublabelKey)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 mt-3">
        <span className="text-[10px] font-sans text-muted-foreground">
          {t("mapSelector.ruleCountLabel", { count: ruleCount })}
        </span>
        <span className="text-[10px] font-sans text-muted-foreground">
          {t("mapSelector.winCountLabel", { count: winConditionCount })}
        </span>
      </div>
    </div>
  )
}
