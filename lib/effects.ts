export type GameMap = "rift" | "aram"

export interface RuleCategory {
  id: string
  name: string
  description: string
  icon: string
  enabled: boolean
}

export interface Rule {
  id: string
  categoryId: string
  name: string
  description: string
  maps: GameMap[]
}

export const defaultCategories: RuleCategory[] = [
  {
    id: "summoner-spells",
    name: "Summoner Spells",
    description: "Constraints on which summoner spells can be used",
    icon: "summoner",
    enabled: true,
  },
  {
    id: "items",
    name: "Item Restrictions",
    description: "Constraints on item purchases and builds",
    icon: "items",
    enabled: true,
  },
  {
    id: "skills",
    name: "Skill Restrictions",
    description: "Constraints on ability usage and leveling",
    icon: "skills",
    enabled: true,
  },
  {
    id: "champion",
    name: "Champion Rules",
    description: "Additional constraints on champion pick or play style",
    icon: "champion",
    enabled: true,
  },
  {
    id: "economy",
    name: "Economy Rules",
    description: "Gold and resource constraints",
    icon: "economy",
    enabled: true,
  },
]

export const rules: Rule[] = [
  // Summoner Spells
  { id: "ss-1", categoryId: "summoner-spells", name: "Snow Fight", description: "One summoner spell must be Snowball, the other is free choice", maps: ["aram"] },
  { id: "ss-2", categoryId: "summoner-spells", name: "No Flash", description: "Cannot take Flash as a summoner spell", maps: ["rift", "aram"] },
  { id: "ss-3", categoryId: "summoner-spells", name: "Ignite + Exhaust Only", description: "Locked to Ignite and Exhaust as your two summoner spells", maps: ["rift", "aram"] },
  { id: "ss-4", categoryId: "summoner-spells", name: "Heal + Barrier Only", description: "Defensive spells only - locked to Heal and Barrier", maps: ["rift", "aram"] },
  { id: "ss-5", categoryId: "summoner-spells", name: "Teleport Required", description: "One summoner spell must be Teleport", maps: ["rift"] },
  { id: "ss-6", categoryId: "summoner-spells", name: "Ghost Required", description: "One summoner spell must be Ghost", maps: ["rift", "aram"] },
  { id: "ss-7", categoryId: "summoner-spells", name: "Cleanse + Ignite Only", description: "Locked to Cleanse and Ignite", maps: ["rift", "aram"] },
  { id: "ss-8", categoryId: "summoner-spells", name: "Meditation", description: "Locked to Heal and Cleanse", maps: ["rift", "aram"] },
  { id: "ss-9", categoryId: "summoner-spells", name: "Double Buff", description: "Locked to Heal and Clarity", maps: ["aram"] },
  
  // Item Restrictions
  { id: "it-1", categoryId: "items", name: "No Legendary Items", description: "Can only buy Epic tier items and below", maps: ["rift", "aram"] },
  { id: "it-2", categoryId: "items", name: "Boots Only Start", description: "First item purchased must be boots", maps: ["rift"] },
  { id: "it-3", categoryId: "items", name: "No Defensive Items", description: "Cannot buy any armor or magic resistance items", maps: ["rift", "aram"] },
  { id: "it-4", categoryId: "items", name: "Doran's Start Required", description: "Must start with a Doran's item", maps: ["rift"] },
  { id: "it-5", categoryId: "items", name: "No Potions", description: "Cannot purchase any potions for the entire game", maps: ["rift", "aram"] },
  { id: "it-6", categoryId: "items", name: "Opponent Picks First Item", description: "Your opponent chooses your starting item", maps: ["rift", "aram"] },
  { id: "it-7", categoryId: "items", name: "No Boots Allowed", description: "Cannot purchase any boots for the entire game", maps: ["rift", "aram"] },
  { id: "it-8", categoryId: "items", name: "Full Lethality/Pen Build", description: "All items must include lethality or penetration stats", maps: ["rift", "aram"] },
  { id: "it-9", categoryId: "items", name: "Reroll Build", description: "Buy items in the order they appear in the shop - no choosing", maps: ["aram"] },
  { id: "it-10", categoryId: "items", name: "Full AP Build", description: "All items must include ability power stats", maps: ["aram"] },
  { id: "it-11", categoryId: "items", name: "Full Stack", description: "Can not have empty slots", maps: ["aram"] },

  // Skill Restrictions
  { id: "sk-1", categoryId: "skills", name: "No Ultimate", description: "Cannot level or use your R ability", maps: ["rift", "aram"] },
  { id: "sk-2", categoryId: "skills", name: "No Q Ability", description: "Cannot level or use your Q ability", maps: ["rift", "aram"] },
  { id: "sk-3", categoryId: "skills", name: "No W Ability", description: "Cannot level or use your W ability", maps: ["rift", "aram"] },
  { id: "sk-4", categoryId: "skills", name: "No E Ability", description: "Cannot level or use your E ability", maps: ["rift", "aram"] },
  { id: "sk-5", categoryId: "skills", name: "Must Max Q First", description: "Forced to max your Q ability first", maps: ["rift", "aram"] },
  { id: "sk-6", categoryId: "skills", name: "Must Max W First", description: "Forced to max your W ability first", maps: ["rift", "aram"] },
  { id: "sk-7", categoryId: "skills", name: "Must Max E First", description: "Forced to max your E ability first", maps: ["rift", "aram"] },
  { id: "sk-8", categoryId: "skills", name: "2 3 3 3", description: "Max 2 points in R, 3 points in Q, 3 points in W, 3 points in E", maps: ["rift", "aram"] },
  { id: "sk-9", categoryId: "skills", name: "No Mouse", description: "Forced to play with trackpad only", maps: ["rift", "aram"] },
  { id: "sk-10", categoryId: "skills", name: "Shifting Keybinds", description: "Q -> W, W -> E, E -> R, R -> Q", maps: ["rift", "aram"] },

  // Champion Rules
  { id: "ch-1", categoryId: "champion", name: "Swap Champions", description: "Each player rolls, then swap champions with each other", maps: ["rift", "aram"] },
  { id: "ch-2", categoryId: "champion", name: "Mirror Match", description: "Both players play the same randomly rolled champion", maps: ["rift", "aram"] },
  { id: "ch-3", categoryId: "champion", name: "Role Swap Build", description: "If you roll a mage, build AD. If fighter, build AP", maps: ["rift", "aram"] },
  { id: "ch-4", categoryId: "champion", name: "Locked Camera", description: "Must play the entire match with locked camera", maps: ["rift", "aram"] },
  { id: "ch-5", categoryId: "champion", name: "No Recall Until Kill", description: "Cannot use recall until you score first blood", maps: ["rift"] },
  { id: "ch-6", categoryId: "champion", name: "Must Emote After Kill", description: "Must use an emote or mastery after every kill", maps: ["rift", "aram"] },
  { id: "ch-7", categoryId: "champion", name: "Die to Shop", description: "Can only buy items by dying - never use recall", maps: ["aram"] },

  // Economy Rules
  { id: "ec-1", categoryId: "economy", name: "No Selling Items", description: "Once purchased, items are permanent and cannot be sold", maps: ["rift", "aram"] },
  { id: "ec-2", categoryId: "economy", name: "Tear Start", description: "Must start with a Tear of the Goddess regardless of champion", maps: ["rift", "aram"] },
  { id: "ec-3", categoryId: "economy", name: "Dark Seal Start", description: "Must start with a Dark Seal regardless of champion", maps: ["rift"] },
  { id: "ec-4", categoryId: "economy", name: "No Component Combining", description: "Cannot combine components - only buy full items or components", maps: ["rift", "aram"] },
  { id: "ec-5", categoryId: "economy", name: "Long Sword Only Start", description: "Must start with a Long Sword regardless of champion", maps: ["rift"] },
  { id: "ec-6", categoryId: "economy", name: "No Wards", description: "Cannot purchase or place any wards", maps: ["rift"] },
  { id: "ec-7", categoryId: "economy", name: "Guardian Items Only", description: "Can only buy Guardian item upgrades and boots", maps: ["aram"] },
]

export function getRulesForEnabledCategories(categories: RuleCategory[], map?: GameMap): Rule[] {
  const enabledIds = new Set(categories.filter((c) => c.enabled).map((c) => c.id))
  return rules.filter((r) => enabledIds.has(r.categoryId) && (!map || r.maps.includes(map)))
}

export function getCategoryById(categoryId: string): RuleCategory | undefined {
  return defaultCategories.find((c) => c.id === categoryId)
}

export function getRuleCountByCategory(categoryId: string): number {
  return rules.filter((r) => r.categoryId === categoryId).length
}
