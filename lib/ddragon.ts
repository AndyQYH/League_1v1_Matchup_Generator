import type { Champion } from "./champions"

const DDRAGON_VERSION = "16.3.1"
const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`
const DDRAGON_LOCALE_EN = "en_US"
const DDRAGON_LOCALE_ZH = "zh_CN"

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

  const enData = await fetchChampionDataset(DDRAGON_LOCALE_EN)

  let zhData: Record<string, DdragonChampionData> = {}
  try {
    zhData = await fetchChampionDataset(DDRAGON_LOCALE_ZH)
  } catch (error) {
    console.warn("Failed to load zh_CN champion dataset", error)
  }

  cachedChampions = Object.values(enData)
    .map((champ) => {
      const zhEntry = zhData[champ.id]

      return {
        id: champ.id,
        name: champ.name,
        title: champ.title,
        role: mapTag(champ.tags[0]),
        image: getChampionLoadingImage(champ.id),
        localized: zhEntry
          ? {
              zh: {
                name: zhEntry.name,
                title: zhEntry.title,
              },
            }
          : undefined,
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  return cachedChampions
}

async function fetchChampionDataset(locale: string): Promise<Record<string, DdragonChampionData>> {
  const res = await fetch(`${DDRAGON_BASE}/data/${locale}/champion.json`)
  if (!res.ok) {
    throw new Error(`Failed to fetch champion data (${locale}): ${res.status}`)
  }
  const json: DdragonResponse = await res.json()
  return json.data
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
