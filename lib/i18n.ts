export type Locale = "en" | "zh"

const en = {
  language: {
    label: "Language",
    switchHint: "Switch language",
    shortEnglish: "EN",
    shortChinese: "中文",
  },
  header: {
    title: "Champion Roulette",
    subtitle: "1v1 Randomizer Tool",
    reset: "Reset",
  },
  rollingStudio: {
    label: "Rolling Studio",
    title: "Control the spin",
    tabs: {
      champion: "Champion",
      rule: "Rule",
      win: "Win Condition",
    },
    rollAll: "Roll All",
    champion: {
      rollTitle: "Champion Roll",
      description: "Populates {count} champion slots from your filtered pool.",
      deckProgress: "Deck Progress",
      buttonIdle: "Roll Champion",
      buttonBusy: "Rolling...",
      spotlight: {
        noneAvailable: "No champions available with the current role filters.",
        generating: "Generating champion {current} / {total}",
        deckReady: "Deck ready! Roll again to reshuffle.",
        prompt: "Roll Champion to populate your deck.",
      },
    },
    rule: {
      rollTitle: "Rule Roll",
      description: "Filters respect your map and category settings. Use this roll to enforce quirky twists.",
      buttonIdle: "Roll Rule",
      buttonBusy: "Rolling...",
      availability: {
        noCategory: "Enable at least one rule category",
        noMap: "No rules available for this map. Adjust filters or switch maps.",
      },
    },
    win: {
      rollTitle: "Win Condition Roll",
      description: "Determines how the duel ends. Combine with rules for spicy scenarios.",
      buttonIdle: "Roll Win Condition",
      buttonBusy: "Rolling...",
      availability: {
        noMap: "No win conditions available on this map. Try another map.",
        empty: "No win conditions available. Add more to the pool.",
      },
    },
  },
  resultPool: {
    label: "Result Pool",
    title: "Ready-made matchups",
    optionsGenerated: "{current}/{total} options generated",
    ruleLabel: "Rule",
    awaiting: "Awaiting roll...",
    winLabel: "Win Condition",
    winHelper: "Displayed in the global panel below.",
    pending: "Pending champion roll",
    empty: "Roll champions to populate your matchups. They will appear here with the current rule while sharing a single win condition below.",
    globalPanel: {
      label: "Win Condition",
      title: "Victory target",
      synced: "Synced with current roll",
      waiting: "Awaiting roll",
      prompt: "Roll a win condition to lock it in for this pool.",
    },
  },
  mapSelector: {
    label: "Map",
    maps: {
      all: { name: "All Maps", sublabel: "No filter" },
      rift: { name: "Summoner's Rift", sublabel: "Normal" },
      aram: { name: "Howling Abyss", sublabel: "ARAM" },
    },
    ruleCountLabel: "{count} rules",
    winCountLabel: "{count} win conditions",
  },
  roleFilter: {
    labelWithCount: "Filter by Role ({filtered}/{total})",
    clearAll: "Clear All",
    selectAll: "Select All",
    ariaLabel: "Filter by {role}",
  },
  categoryToggles: {
    title: "Rule Categories",
    status: "{enabled}/{total} active",
    rulesAvailable: "{count} rules available",
    enableAll: "Enable All",
    disableAll: "Disable All",
    ruleCount: "{count} rules",
  },
  cards: {
    champion: {
      pending: "Pending",
      awaiting: "Awaiting champion...",
    },
    rule: {
      awaiting: "Awaiting rule...",
    },
    win: {
      awaiting: "Awaiting win condition...",
    },
    mapsAll: "All Maps",
  },
  ruleCard: {
    categories: {
      "summoner-spells": "Summoner Spell",
      items: "Item Restriction",
      skills: "Skill Restriction",
      champion: "Champion Rule",
      economy: "Economy Rule",
      runes: "Rune Rule",
    },
  },
  roles: {
    Fighter: "Fighter",
    Mage: "Mage",
    Assassin: "Assassin",
    Marksman: "Marksman",
    Support: "Support",
    Tank: "Tank",
  },
  status: {
    loadingChampions: "Loading champions from Data Dragon...",
    tryAgain: "Try Again",
  },
  sidebar: {
    stats: {
      champions: "Champions",
      roles: "Roles",
      categories: "Categories",
      rules: "Rules",
      wins: "Win Cons",
      totalWins: "Total pool: {total}",
    },
    accordions: {
      roles: "Roles",
      categories: "Rule Categories",
    },
    championOptions: {
      label: "Champion Options",
      helper: "Choose how many random champions to roll at once.",
    },
  },
}

const zh: typeof en = {
  language: {
    label: "语言",
    switchHint: "切换语言",
    shortEnglish: "EN",
    shortChinese: "中文",
  },
  header: {
    title: "英雄轮盘",
    subtitle: "1v1 随机对决工具",
    reset: "重置",
  },
  rollingStudio: {
    label: "抽取控制台",
    title: "掌控抽取",
    tabs: {
      champion: "英雄",
      rule: "规则",
      win: "胜利条件",
    },
    rollAll: "全部抽取",
    champion: {
      rollTitle: "英雄抽取",
      description: "从筛选后的池子中抽取 {count} 名英雄。",
      deckProgress: "英雄池进度",
      buttonIdle: "抽取英雄",
      buttonBusy: "抽取中...",
      spotlight: {
        noneAvailable: "当前角色筛选无可用英雄。",
        generating: "正在生成英雄 {current} / {total}",
        deckReady: "英雄池已就绪！再次抽取可重新洗牌。",
        prompt: "抽取英雄以填充你的池子。",
      },
    },
    rule: {
      rollTitle: "规则抽取",
      description: "会遵循地图和类别设置，适合制造特殊条件。",
      buttonIdle: "抽取规则",
      buttonBusy: "抽取中...",
      availability: {
        noCategory: "请至少启用一个规则类别",
        noMap: "该地图下无可用规则，请调整筛选或更换地图。",
      },
    },
    win: {
      rollTitle: "胜利条件抽取",
      description: "决定对局的胜利方式，可与规则组合出新花样。",
      buttonIdle: "抽取胜利条件",
      buttonBusy: "抽取中...",
      availability: {
        noMap: "该地图下无胜利条件，请选择其他地图。",
        empty: "没有可用的胜利条件，请添加更多选项。",
      },
    },
  },
  resultPool: {
    label: "结果池",
    title: "现成的对局组合",
    optionsGenerated: "{current}/{total} 个选项已生成",
    ruleLabel: "规则",
    awaiting: "等待抽取...",
    winLabel: "胜利条件",
    winHelper: "在下方全局面板中查看。",
    pending: "等待英雄抽取",
    empty: "抽取英雄以填充对局组合，他们会在此展示，并共享下方的胜利条件。",
    globalPanel: {
      label: "胜利条件",
      title: "胜利目标",
      synced: "已与当前抽取同步",
      waiting: "等待抽取",
      prompt: "抽取胜利条件以锁定该结果池。",
    },
  },
  mapSelector: {
    label: "地图",
    maps: {
      all: { name: "全部地图", sublabel: "无筛选" },
      rift: { name: "召唤师峡谷", sublabel: "标准" },
      aram: { name: "嚎哭深渊", sublabel: "大乱斗" },
    },
    ruleCountLabel: "{count} 条规则",
    winCountLabel: "{count} 个胜利条件",
  },
  roleFilter: {
    labelWithCount: "按定位筛选 ({filtered}/{total})",
    clearAll: "清除全部",
    selectAll: "全部选择",
    ariaLabel: "按 {role} 筛选",
  },
  categoryToggles: {
    title: "规则类别",
    status: "启用 {enabled}/{total}",
    rulesAvailable: "可用规则 {count} 条",
    enableAll: "全部启用",
    disableAll: "全部禁用",
    ruleCount: "{count} 条规则",
  },
  cards: {
    champion: {
      pending: "待定",
      awaiting: "等待英雄...",
    },
    rule: {
      awaiting: "等待规则...",
    },
    win: {
      awaiting: "等待胜利条件...",
    },
    mapsAll: "全部地图",
  },
  ruleCard: {
    categories: {
      "summoner-spells": "召唤师技能规则",
      items: "出装限制",
      skills: "技能限制",
      champion: "英雄规则",
      economy: "经济规则",
      runes: "符文规则",
    },
  },
  roles: {
    Fighter: "战士",
    Mage: "法师",
    Assassin: "刺客",
    Marksman: "射手",
    Support: "辅助",
    Tank: "坦克",
  },
  status: {
    loadingChampions: "正在从 Data Dragon 加载英雄...",
    tryAgain: "重试",
  },
  sidebar: {
    stats: {
      champions: "英雄",
      roles: "定位",
      categories: "类别",
      rules: "规则",
      wins: "胜利条件",
      totalWins: "总池：{total}",
    },
    accordions: {
      roles: "角色定位",
      categories: "规则类别",
    },
    championOptions: {
      label: "英雄数量",
      helper: "选择一次要抽取多少名随机英雄。",
    },
  },
}

export const translations = {
  en,
  zh,
}

export type TranslationShape = typeof en

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}.${P}`
    : never
  : never

type Leaves<T> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object ? Join<K, Leaves<T[K]>> : K
    }[keyof T & string]
  : never

export type TranslationKey = Leaves<TranslationShape>

export function translate(
  locale: Locale,
  key: TranslationKey,
  vars?: Record<string, string | number>
): string {
  const segments = key.split(".")
  const base = translations[locale] ?? translations.en
  let result: any = base
  for (const segment of segments) {
    if (result && typeof result === "object" && segment in result) {
      result = result[segment]
    } else {
      result = undefined
      break
    }
  }

  if (typeof result !== "string") {
    // fallback to English or key itself
    let fallback: any = translations.en
    for (const segment of segments) {
      if (fallback && typeof fallback === "object" && segment in fallback) {
        fallback = fallback[segment]
      } else {
        fallback = key
        break
      }
    }
    result = typeof fallback === "string" ? fallback : key
  }

  if (!vars) {
    return result
  }

  return result.replace(/\{(\w+)\}/g, (_, token) =>
    token in vars ? String(vars[token]) : `{${token}}`
  )
}
