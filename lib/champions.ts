import type { Locale } from "./i18n"

export interface Champion {
  id: string
  name: string
  title: string
  role: "Fighter" | "Mage" | "Assassin" | "Marksman" | "Support" | "Tank"
  image: string
  localized?: Partial<Record<Locale, { name: string; title: string }>>
}

export const roleColors: Record<Champion["role"], string> = {
  Fighter: "text-orange-400 border-orange-400/30 bg-orange-400/10",
  Mage: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  Assassin: "text-red-400 border-red-400/30 bg-red-400/10",
  Marksman: "text-yellow-300 border-yellow-300/30 bg-yellow-300/10",
  Support: "text-green-400 border-green-400/30 bg-green-400/10",
  Tank: "text-slate-300 border-slate-300/30 bg-slate-300/10",
}
