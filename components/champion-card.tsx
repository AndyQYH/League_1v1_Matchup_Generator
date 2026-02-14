"use client"

import { Champion, roleColors } from "@/lib/champions"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/components/language-provider"
import type { TranslationKey } from "@/lib/i18n"

const variantStyles = {
  standard: {
    wrapper: "w-full max-w-[16rem]",
    card: "w-full",
    image: "h-[380px]",
    title: "text-xl",
    subtitle: "text-sm",
    badge: "text-xs px-2.5 py-1",
    placeholderIcon: { width: 48, height: 48 },
    placeholderText: "text-sm",
    placeholderHeight: "h-[380px]",
  },
  compact: {
    wrapper: "w-28 min-w-[7rem] sm:w-32 sm:min-w-[8rem]",
    card: "w-full",
    image: "h-32 sm:h-36",
    title: "text-sm",
    subtitle: "text-[11px]",
    badge: "text-[10px] px-2 py-0.5",
    placeholderIcon: { width: 32, height: 32 },
    placeholderText: "text-[11px]",
    placeholderHeight: "h-32 sm:h-36",
  },
} as const

interface ChampionCardProps {
  champion: Champion | null
  isSpinning: boolean
  variant?: keyof typeof variantStyles
}

export function ChampionCard({ champion, isSpinning, variant = "standard" }: ChampionCardProps) {
  const config = variantStyles[variant]
  const { t, locale } = useLanguage()

  if (!champion) {
    const placeholderLabel =
      variant === "compact"
        ? t("cards.champion.pending")
        : t("cards.champion.awaiting")
    return (
      <div className={cn("relative flex flex-col items-center", config.wrapper)}>
        <div
          className={cn(
            "relative rounded-lg border-2 border-dashed border-border bg-card/50 flex items-center justify-center overflow-hidden",
            config.card,
            config.placeholderHeight
          )}
        >
          <div className="absolute inset-0 animate-shimmer" />
          <div className="flex flex-col items-center gap-3 text-muted-foreground px-3 text-center">
            <svg
              width={config.placeholderIcon.width}
              height={config.placeholderIcon.height}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="opacity-40"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
            </svg>
            <p className={cn("font-sans", config.placeholderText)}>{placeholderLabel}</p>
          </div>
        </div>
      </div>
    )
  }

  const localizedCopy = champion.localized?.[locale]
  const displayName = localizedCopy?.name ?? champion.name
  const displayTitle = localizedCopy?.title ?? champion.title

  const roleKey = `roles.${champion.role}` as TranslationKey
  const roleLabel = t(roleKey)

  return (
    <div
      className={cn(
        "relative flex flex-col items-center transition-all duration-500",
        config.wrapper,
        isSpinning && variant === "standard" && "scale-95 opacity-50"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border border-border bg-card shadow-lg animate-pulse-glow",
          config.card
        )}
      >
        {/* Champion Image */}
        <div className={cn("relative w-full overflow-hidden", config.image)}>
          <img
            src={champion.image}
            alt={`${displayName} splash art`}
            className="w-full h-full object-cover object-top"
            crossOrigin="anonymous"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />

          {/* Role badge */}
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className={cn(
                "font-sans font-semibold backdrop-blur-sm",
                config.badge,
                roleColors[champion.role]
              )}
            >
              {roleLabel}
            </Badge>
          </div>
        </div>

        {/* Champion Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
          <h3
            className={cn(
              "font-serif font-bold text-[hsl(var(--primary))] tracking-wide text-balance",
              config.title
            )}
          >
            {displayName}
          </h3>
          <p className={cn("text-muted-foreground font-sans mt-0.5", config.subtitle)}>
            {displayTitle}
          </p>
        </div>
      </div>
    </div>
  )
}
