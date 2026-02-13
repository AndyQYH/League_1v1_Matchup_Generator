import type { GameMap } from "@/lib/effects"

export interface WinCondition {
  id: string
  name: string
  description: string
  icon: "kill" | "tower" | "cs" | "gold" | "time" | "custom"
  maps: GameMap[]
}

export const winConditions: WinCondition[] = [
  {
    id: "wc-first-blood",
    name: "First Blood",
    description: "First player to score a kill wins the match.",
    icon: "kill",
    maps: ["rift", "aram"],
  },
  {
    id: "wc-first-tower",
    name: "First Tower",
    description: "First player to destroy a tower wins the match.",
    icon: "tower",
    maps: ["rift", "aram"],
  },
  {
    id: "wc-100-cs",
    name: "100 CS Race",
    description: "First player to reach 100 creep score wins the match.",
    icon: "cs",
    maps: ["rift"],
  },
  {
    id: "wc-first-to-3",
    name: "First to 3 Kills",
    description: "First player to score 3 kills wins the match.",
    icon: "kill",
    maps: ["rift", "aram"],
  },
  {
    id: "wc-10-min-cs",
    name: "10 Minute CS Check",
    description: "Player with the most CS at the 10-minute mark wins. Kills are tiebreakers.",
    icon: "time",
    maps: ["rift", "aram"],
  },
  {
    id: "wc-first-to-2-kills-tower",
    name: "2 Kills or Tower",
    description: "First player to score 2 kills or destroy a tower wins the match.",
    icon: "kill",
    maps: ["rift", "aram"],
  },
  {
    id: "wc-killing-spree-10",
    name: "Killing Spree in 10 Minutes",
    description: "The player with the most kills at the 10-minute mark wins the match.",
    icon: "kill",
    maps: ["rift", "aram"],
  },
  {
    id: "wc-inhibitor",
    name: "First Inhibitor",
    description: "First player to destroy an inhibitor wins the match.",
    icon: "tower",
    maps: ["rift", "aram"],
  },
  {
    id: "wc-nexus-turret",
    name: "First Nexus Turret",
    description: "First player to destroy a Nexus turret wins the match.",
    icon: "tower",
    maps: ["aram"],
  }
]

export function getWinConditionsForMap(map?: GameMap): WinCondition[] {
  if (!map) return winConditions
  return winConditions.filter((wc) => wc.maps.includes(map))
}
