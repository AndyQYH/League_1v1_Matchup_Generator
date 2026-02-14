"use client"

import type { Champion } from "@/lib/champions"
import { roleColors } from "@/lib/champions"
import { cn } from "@/lib/utils"
import { Swords, Wand2, Skull, Crosshair, Heart, ShieldHalf } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import type { TranslationKey } from "@/lib/i18n"

const allRoles: Champion["role"][] = [
  "Fighter",
  "Mage",
  "Assassin",
  "Marksman",
  "Support",
  "Tank",
]

const roleIcons: Record<Champion["role"], React.ComponentType<{ className?: string }>> = {
  Fighter: Swords,
  Mage: Wand2,
  Assassin: Skull,
  Marksman: Crosshair,
  Support: Heart,
  Tank: ShieldHalf,
}

interface RoleFilterProps {
  enabledRoles: Set<Champion["role"]>
  onToggleRole: (role: Champion["role"]) => void
  onSelectAll: () => void
  onClearAll: () => void
  filteredCount: number
  totalCount: number
}

export function RoleFilter({
  enabledRoles,
  onToggleRole,
  onSelectAll,
  onClearAll,
  filteredCount,
  totalCount,
}: RoleFilterProps) {
  const allSelected = enabledRoles.size === allRoles.length
  const { t } = useLanguage()
  const label = t("roleFilter.labelWithCount", {
    filtered: filteredCount,
    total: totalCount,
  })

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-sans text-muted-foreground">{label}</p>
        <button
          onClick={allSelected ? onClearAll : onSelectAll}
          className="text-[10px] font-sans text-muted-foreground hover:text-foreground transition-colors"
        >
          {allSelected ? t("roleFilter.clearAll") : t("roleFilter.selectAll")}
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {allRoles.map((role) => {
          const Icon = roleIcons[role]
          const isActive = enabledRoles.has(role)
          const colors = roleColors[role]
          // Extract the base color from the roleColors string for consistent styling
          const textColor = colors.split(" ")[0] // e.g. "text-orange-400"
          const roleKey = `roles.${role}` as TranslationKey
          const roleLabel = t(roleKey)

          return (
            <button
              key={role}
              onClick={() => onToggleRole(role)}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs font-sans font-medium transition-all",
                isActive
                  ? cn(colors, "border-current/30")
                  : "border-border/50 bg-transparent text-muted-foreground/50 opacity-50 hover:opacity-75"
              )}
              aria-pressed={isActive}
              aria-label={t("roleFilter.ariaLabel", { role: roleLabel })}
            >
              <Icon className={cn("w-3.5 h-3.5", isActive ? textColor : "text-current")} />
              {roleLabel}
            </button>
          )
        })}
      </div>
    </div>
  )
}
