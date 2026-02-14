import type { Locale } from "@/lib/i18n"
import type { Rule } from "@/lib/effects"
import type { WinCondition } from "@/lib/win-conditions"

type LocalizedFields = {
  name?: string
  description?: string
}

type LocaleBucket = Partial<Record<Locale, LocalizedFields>>

const RULE_TRANSLATIONS: Record<string, LocaleBucket> = {
  "ss-1": {
    zh: {
      name: "堆雪人",
      description: "一个召唤师技能必须是雪球，另一个随便。",
    },
  },
  "ss-2": {
    zh: {
      name: "杀就掉血",
      description: "召唤师技能不能带闪现。",
    },
  },
  "ss-3": {
    zh: {
      name: "有点虚",
      description: "两个召唤师技能固定为点燃与虚弱。",
    },
  },
  "ss-4": {
    zh: {
      name: "活着才能输出",
      description: "两个召唤师技能固定为治疗与屏障。",
    },
  },
  "ss-5": {
    zh: {
      name: "穿越剧",
      description: "至少有一个召唤师技能必须是传送。",
    },
  },
  "ss-6": {
    zh: {
      name: "跑快快",
      description: "至少有一个召唤师技能必须是幽灵疾步。",
    },
  },
  "ss-7": {
    zh: {
      name: "净燃人",
      description: "召唤师技能固定为净化与点燃。",
    },
  },
  "ss-8": {
    zh: {
      name: "养生",
      description: "召唤师技能固定为治疗与净化。",
    },
  },
  "ss-9": {
    zh: {
      name: "双爸扶",
      description: "召唤师技能固定为治疗与清晰术。",
    },
  },
  "it-1": {
    zh: {
      name: "传说只在传说里",
      description: "只能购买史诗级及以下的装备。",
    },
  },
  "it-2": {
    zh: {
      name: "鞋教",
      description: "第一件购买的装备必须是鞋子。",
    },
  },
  "it-3": {
    zh: {
      name: "有备无防",
      description: "不可购买任何护甲或魔抗装备。",
    },
  },
  "it-4": {
    zh: {
      name: "多兰起手",
      description: "必须以任意多兰装备开局。",
    },
  },
  "it-5": {
    zh: {
      name: "禁药",
      description: "整局不得购买任何药水。",
    },
  },
  "it-6": {
    zh: {
      name: "不由自己",
      description: "你的起始装备由对手指定。",
    },
  },
  "it-7": {
    zh: {
      name: "光脚的不怕穿鞋的",
      description: "整局不得购买任何鞋子。",
    },
  },
  "it-8": {
    zh: {
      name: "穿麻",
      description: "所有装备都必须带有穿甲或穿透属性。",
    },
  },
  "it-9": {
    zh: {
      name: "顺其自然",
      description: "必须按照商店出现的顺序购买装备，不能挑选。",
    },
  },
  "it-10": {
    zh: {
      name: "巴啦啦小魔仙",
      description: "所有装备都必须提供法术强度。",
    },
  },
  "it-11": {
    zh: {
      name: "全栈",
      description: "工具栏不得留下空位。",
    },
  },
  "sk-1": {
    zh: {
      name: "禁用大招",
      description: "不能升级或释放你的R技能。",
    },
  },
  "sk-2": {
    zh: {
      name: "禁用Q",
      description: "不能升级或释放你的Q技能。",
    },
  },
  "sk-3": {
    zh: {
      name: "禁用W",
      description: "不能升级或释放你的W技能。",
    },
  },
  "sk-4": {
    zh: {
      name: "禁用E",
      description: "不能升级或释放你的E技能。",
    },
  },
  "sk-5": {
    zh: {
      name: "优先加满Q",
      description: "必须最先将Q技能点满。",
    },
  },
  "sk-6": {
    zh: {
      name: "优先加满W",
      description: "必须最先将W技能点满。",
    },
  },
  "sk-7": {
    zh: {
      name: "优先加满E",
      description: "必须最先将E技能点满。",
    },
  },
  "sk-8": {
    zh: {
      name: "2333",
      description: "R最多2点，Q/W/E各点3级。",
    },
  },
  "sk-9": {
    zh: {
      name: "不用鼠标",
      description: "必须使用触控板或等效设备进行操作。",
    },
  },
  "sk-10": {
    zh: {
      name: "键位轮换",
      description: "Q→W→E→R，技能键位按顺序错位。",
    },
  },
  "ch-1": {
    zh: {
      name: "角色互换",
      description: "双方先各自随机，然后互换英雄。",
    },
  },
  "ch-2": {
    zh: {
      name: "镜像对决",
      description: "双方使用同一个随机英雄。",
    },
  },
  "ch-3": {
    zh: {
      name: "阴阳交错",
      description: "抽到AP就出AD，抽到AD就出AP。",
    },
  },
  "ch-4": {
    zh: {
      name: "锁头",
      description: "整局必须开启锁定镜头。",
    },
  },
  "ch-5": {
    zh: {
      name: "空城",
      description: "拿到首杀前不得使用回城。",
    },
  },
  "ch-6": {
    zh: {
      name: "击情",
      description: "每次击杀后必须发送表情或 mastery。",
    },
  },
  "ch-7": {
    zh: {
      name: "要钱不要命",
      description: "只能通过阵亡回城来购物，禁止主动回城。",
    },
  },
  "ec-1": {
    zh: {
      name: "永久皮肤",
      description: "一旦买下装备就永久绑定，不能出售。",
    },
  },
  "ec-2": {
    zh: {
      name: "泪流满面",
      description: "女神之泪开局。",
    },
  },
  "ec-3": {
    zh: {
      name: "黑暗封印起手",
      description: "开局必须购买黑暗封印。",
    },
  },
  "ec-4": {
    zh: {
      name: "二级鞋起手",
      description: "第一件装备必须直接合成任意二级鞋。",
    },
  },
  "ec-5": {
    zh: {
      name: "剑多识广",
      description: "第一件装备必须是长剑。",
    },
  },
  "ec-6": {
    zh: {
      name: "禁止守卫",
      description: "整局不得购买或放置任何守卫。",
    },
  },
  "ec-7": {
    zh: {
      name: "仅守护者装备",
      description: "只能购买守护者升级线的装备与鞋子。",
    },
  },
  "ru-1": {
    zh: {
      name: "书呆子",
      description: "主系基石必须选择启封秘籍。",
    },
  },
  "ru-2": {
    zh: {
      name: "坚决副系",
      description: "副系符文必须选择坚决系。",
    },
  },
  "ru-3": {
    zh: {
      name: "适者生存",
      description: "符文配置需至少点出吸收生命、过度生长、风暴聚集中的任意两项。",
    },
  },
  "ru-4": {
    zh: {
      name: "冰川锁链",
      description: "主系基石必须是冰川增幅，并搭配风暴聚集。",
    },
  },
  "ru-5": {
    zh: {
      name: "稳住别浪",
      description: "主树必须点守护者→拆塔专家→骸骨镀层→坚定。",
    },
  },
  "ru-6": {
    zh: {
      name: "玻璃炮弹",
      description: "主树必须点电刑→恶意中伤→第六感→终极猎人。",
    },
  },
  "ru-7": {
    zh: {
      name: "赌贩子",
      description: "主树必须点先攻→返现→三重调和→万事通。",
    },
  },
  "ru-8": {
    zh: {
      name: "Deja Vu",
      description: "必须同时点出相位猛冲、迅捷、水上行走、神奇之鞋。",
    },
  },
  "ru-9": {
    zh: {
      name: "连环炮手",
      description: "主树必须携带致命节奏与传说：欢欣。",
    },
  },
}

const WIN_CONDITION_TRANSLATIONS: Record<string, LocaleBucket> = {
  "wc-first-blood": {
    zh: {
      name: "1血",
      description: "先取得击杀的一方直接获胜。",
    },
  },
  "wc-first-tower": {
    zh: {
      name: "1塔",
      description: "率先摧毁一座防御塔即获胜。",
    },
  },
  "wc-100-cs": {
    zh: {
      name: "100🔪",
      description: "先达到100补刀的一方获胜。",
    },
  },
  "wc-first-to-3": {
    zh: {
      name: "死不过三",
      description: "率先取得3次击杀的玩家获胜。",
    },
  },
  "wc-10-min-cs": {
    zh: {
      name: "10分钟补刀检定",
      description: "10分钟时补刀更多的一方获胜，击杀用于平局裁定。",
    },
  },
  "wc-first-to-2-kills-tower": {
    zh: {
      name: "双杀或1塔",
      description: "率先拿到2次击杀或摧毁一座塔即可取胜。",
    },
  },
  "wc-killing-spree-10": {
    zh: {
      name: "10分钟击杀领先",
      description: "10分钟节点击杀数更多者获胜。",
    },
  },
  "wc-inhibitor": {
    zh: {
      name: "首个水晶",
      description: "先摧毁对手的抑制器即获胜。",
    },
  },
  "wc-nexus-turret": {
    zh: {
      name: "首个基地塔",
      description: "率先拆掉基地防御塔者获胜。",
    },
  },
}

export function getLocalizedRuleContent(rule: Rule, locale: Locale): { name: string; description: string } {
  if (locale === "zh") {
    const zh = RULE_TRANSLATIONS[rule.id]?.zh
    if (zh) {
      return {
        name: zh.name ?? rule.name,
        description: zh.description ?? rule.description,
      }
    }
  }
  return { name: rule.name, description: rule.description }
}

export function getLocalizedWinConditionContent(
  condition: WinCondition,
  locale: Locale
): { name: string; description: string } {
  if (locale === "zh") {
    const zh = WIN_CONDITION_TRANSLATIONS[condition.id]?.zh
    if (zh) {
      return {
        name: zh.name ?? condition.name,
        description: zh.description ?? condition.description,
      }
    }
  }
  return { name: condition.name, description: condition.description }
}
