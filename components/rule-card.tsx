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
  Sparkles,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import type { TranslationKey } from "@/lib/i18n"
import { getLocalizedRuleContent } from "@/lib/dynamic-translations"

const categoryConfig: Record<
  string,
  {
    labelKey: TranslationKey
    color: string
    bgColor: string
    borderColor: string
    icon: React.ComponentType<{ className?: string }>
  }
> = {
  "summoner-spells": {
    labelKey: "ruleCard.categories.summoner-spells",
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
    icon: Flame,
  },
  items: {
    labelKey: "ruleCard.categories.items",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/30",
    icon: Swords,
  },
  skills: {
    labelKey: "ruleCard.categories.skills",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
    borderColor: "border-rose-400/30",
    icon: Zap,
  },
  champion: {
    labelKey: "ruleCard.categories.champion",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/30",
    icon: Shield,
  },
  economy: {
    labelKey: "ruleCard.categories.economy",
    color: "text-yellow-300",
    bgColor: "bg-yellow-300/10",
    borderColor: "border-yellow-300/30",
    icon: Coins,
  },
  runes: {
    labelKey: "ruleCard.categories.runes",
    color: "text-purple-200",
    bgColor: "bg-purple-400/10",
    borderColor: "border-purple-300/30",
    icon: Sparkles,
  },
}

const mapChipBase =
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]"

const mapVisuals: Record<
  GameMap,
  { labelKey: TranslationKey; classes: string; icon: React.ComponentType<{ className?: string }> }
> = {
  rift: {
    labelKey: "mapSelector.maps.rift.name",
    classes: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    icon: Map,
  },
  aram: {
    labelKey: "mapSelector.maps.aram.name",
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
  const { t, locale } = useLanguage()

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
            <p className="text-sm font-sans">{t("cards.rule.awaiting")}</p>
          </div>
        </div>
      </div>
    )
  }

  const config = categoryConfig[rule.categoryId] ?? categoryConfig["champion"]
  const Icon = config.icon
  const categoryLabel = t(config.labelKey)
  const localized = getLocalizedRuleContent(rule, locale)

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
        <div className="flex flex-wrap items-start gap-3 mb-3 relative">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-lg",
                config.bgColor,
                config.color
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                className={cn(
                  "font-serif text-lg font-bold tracking-wide break-words leading-tight",
                  config.color
                )}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {localized.name}
              </h3>
            </div>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] font-sans uppercase tracking-wider shrink-0 ml-auto",
              config.borderColor,
              config.color,
              config.bgColor
            )}
          >
            {categoryLabel}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground font-sans leading-relaxed relative mt-1">
          {localized.description}
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
              {t("cards.mapsAll")}
            </span>
          ) : (
            rule.maps.map((mapId) => {
              const details = mapVisuals[mapId]
              const Icon = details.icon
              return (
                <span key={mapId} className={cn(mapChipBase, details.classes)}>
                  <Icon className="w-3.5 h-3.5" />
                  {t(details.labelKey)}
                </span>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
