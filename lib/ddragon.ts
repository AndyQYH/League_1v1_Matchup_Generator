import type { Champion } from "./champions"

const DDRAGON_VERSION = "16.3.1"
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`

export function getChampionLoadingImage(championId: string): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${championId}_0.jpg`
}

export function getChampionSquareImage(championId: string): string {
  return `${DDRAGON_BASE}/img/champion/${championId}.png`
}

interface DdragonChampionData {
  id: string
  key: string
  name: string
  title: string
  tags: string[]
}

interface DdragonResponse {
  data: Record<string, DdragonChampionData>
}

let cachedChampions: Champion[] | null = null

export async function fetchChampions(): Promise<Champion[]> {
  if (cachedChampions) return cachedChampions

  const res = await fetch(`${DDRAGON_BASE}/data/en_US/champion.json`)
  if (!res.ok) {
    throw new Error(`Failed to fetch champion data: ${res.status}`)
  }

  const json: DdragonResponse = await res.json()

  cachedChampions = Object.values(json.data)
    .map((champ) => ({
      id: champ.id,
      name: champ.name,
      title: champ.title,
      role: mapTag(champ.tags[0]),
      image: getChampionLoadingImage(champ.id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return cachedChampions
}

function mapTag(tag: string): Champion["role"] {
  const mapping: Record<string, Champion["role"]> = {
    Fighter: "Fighter",
    Mage: "Mage",
    Assassin: "Assassin",
    Marksman: "Marksman",
    Support: "Support",
    Tank: "Tank",
  }
  return mapping[tag] ?? "Fighter"
}

export { DDRAGON_VERSION }
