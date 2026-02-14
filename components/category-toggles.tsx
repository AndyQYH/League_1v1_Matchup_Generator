"use client"

import type { RuleCategory } from "@/lib/effects"
import { getRuleCountByCategory } from "@/lib/effects"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Flame,
  Swords,
  Zap,
  Shield,
  Coins,
  Settings2,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import type { TranslationKey } from "@/lib/i18n"

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "summoner-spells": Flame,
  items: Swords,
  skills: Zap,
  champion: Shield,
  economy: Coins,
  runes: Sparkles,
}

const categoryColors: Record<string, string> = {
  "summoner-spells": "text-cyan-400",
  items: "text-amber-400",
  skills: "text-rose-400",
  champion: "text-emerald-400",
  economy: "text-yellow-300",
  runes: "text-purple-300",
}

interface CategoryTogglesProps {
  categories: RuleCategory[]
  onToggle: (categoryId: string) => void
  onEnableAll: () => void
  onDisableAll: () => void
  totalEnabledRules: number
}

export function CategoryToggles({
  categories,
  onToggle,
  onEnableAll,
  onDisableAll,
  totalEnabledRules,
}: CategoryTogglesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const enabledCount = categories.filter((c) => c.enabled).length
  const { t } = useLanguage()

  return (
    <div className="w-full max-w-sm">
      {/* Toggle header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between rounded-lg border border-border bg-card/50 px-4 py-3 hover:bg-card/80 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-sans font-medium text-foreground">
            {t("categoryToggles.title")}
          </span>
          <span className="text-xs font-sans text-muted-foreground">
            {t("categoryToggles.status", { enabled: enabledCount, total: categories.length })}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Expandable content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[500px] opacity-100 mt-2" : "max-h-0 opacity-0"
        )}
      >
        <div className="rounded-lg border border-border bg-card/50 p-4">
          {/* Quick actions */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-sans text-muted-foreground">
              {t("categoryToggles.rulesAvailable", { count: totalEnabledRules })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEnableAll}
                className="h-6 text-[10px] font-sans px-2 text-muted-foreground hover:text-foreground"
              >
                {t("categoryToggles.enableAll")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDisableAll}
                className="h-6 text-[10px] font-sans px-2 text-muted-foreground hover:text-foreground"
              >
                {t("categoryToggles.disableAll")}
              </Button>
            </div>
          </div>

          {/* Category list */}
          <div className="flex flex-col gap-2.5">
            {categories.map((category) => {
              const Icon = categoryIcons[category.id] ?? Shield
              const color = categoryColors[category.id] ?? "text-foreground"
              const ruleCount = getRuleCountByCategory(category.id)
              const labelKey = `ruleCard.categories.${category.id}` as TranslationKey
              const categoryLabel = t(labelKey)

              return (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-3 py-2.5 transition-colors",
                    category.enabled
                      ? "border-border bg-secondary/30"
                      : "border-border/50 bg-transparent opacity-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4", color)} />
                    <div>
                      <p className="text-sm font-sans font-medium text-foreground leading-tight">
                        {categoryLabel}
                      </p>
                      <p className="text-[11px] font-sans text-muted-foreground leading-tight">
                        {t("categoryToggles.ruleCount", { count: ruleCount })}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={category.enabled}
                    onCheckedChange={() => onToggle(category.id)}
                    aria-label={`Toggle ${category.name}`}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
