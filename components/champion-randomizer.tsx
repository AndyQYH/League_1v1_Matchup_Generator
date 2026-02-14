"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChampionCard } from "@/components/champion-card"
import { RuleCard } from "@/components/rule-card"
import { WinConditionCard } from "@/components/win-condition-card"
import { CategoryToggles } from "@/components/category-toggles"
import { RoleFilter } from "@/components/role-filter"
import { MapSelector } from "@/components/map-selector"
import { useLanguage } from "@/components/language-provider"
import { getLocalizedRuleContent, getLocalizedWinConditionContent } from "@/lib/dynamic-translations"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Champion } from "@/lib/champions"
import { fetchChampions } from "@/lib/ddragon"
import {
  defaultCategories,
  getRulesForEnabledCategories,
  type GameMap,
  type RuleCategory,
  type Rule,
} from "@/lib/effects"
import {
  getWinConditionsForMap,
  winConditions,
  type WinCondition,
} from "@/lib/win-conditions"
import {
  Dices,
  RotateCcw,
  ScrollText,
  Sword,
  Loader2,
  Trophy,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

const ALL_ROLES: Champion["role"][] = [
  "Fighter",
  "Mage",
  "Assassin",
  "Marksman",
  "Support",
  "Tank",
]

const CHAMPION_POOL_OPTIONS = [1, 2, 3, 4, 5] as const
const ROLL_VIEWS = [
  { id: "champion" as const, labelKey: "rollingStudio.tabs.champion" as const },
  { id: "rule" as const, labelKey: "rollingStudio.tabs.rule" as const },
  { id: "win" as const, labelKey: "rollingStudio.tabs.win" as const },
]
type RollStep = (typeof ROLL_VIEWS)[number]["id"]

const LANGUAGE_OPTIONS = [
  { value: "en" as const, labelKey: "language.shortEnglish" as const },
  { value: "zh" as const, labelKey: "language.shortChinese" as const },
]

export function ChampionRandomizer() {
  const [champions, setChampions] = useState<Champion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [championDeck, setChampionDeck] = useState<Champion[]>([])
  const [championSpotlight, setChampionSpotlight] = useState<Champion | null>(null)
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null)
  const [selectedWinCondition, setSelectedWinCondition] =
    useState<WinCondition | null>(null)
  const [isChampSpinning, setIsChampSpinning] = useState(false)
  const [isRuleSpinning, setIsRuleSpinning] = useState(false)
  const [isWinSpinning, setIsWinSpinning] = useState(false)
  const [categories, setCategories] = useState<RuleCategory[]>(() =>
    defaultCategories.map((c) => ({ ...c }))
  )
  const [enabledRoles, setEnabledRoles] = useState<Set<Champion["role"]>>(
    () => new Set(ALL_ROLES)
  )
  const [championPoolSize, setChampionPoolSize] = useState<number>(3)
  const [selectedMap, setSelectedMap] = useState<GameMap | null>(null)
  const [activeRollView, setActiveRollView] = useState<"champion" | "rule" | "win">(
    "champion"
  )

  const champTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ruleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const winTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rollSequenceRef = useRef<RollStep[]>([])
  const rollQueueActiveRef = useRef(false)
  const rollQueueDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMobile = useIsMobile()
  const { t, locale, setLocale } = useLanguage()

  // Fetch champions from Data Dragon on mount
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    fetchChampions()
      .then((data) => {
        if (!cancelled) {
          setChampions(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load champions"
          )
          setIsLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Derived data
  const filteredChampions = useMemo(
    () => champions.filter((c) => enabledRoles.has(c.role)),
    [champions, enabledRoles]
  )

  const availableRules = useMemo(
    () => getRulesForEnabledCategories(categories, selectedMap ?? undefined),
    [categories, selectedMap]
  )

  const filteredWinConditions = useMemo(
    () => getWinConditionsForMap(selectedMap ?? undefined),
    [selectedMap]
  )

  const deckCapacityBase = filteredChampions.length
    ? Math.min(championPoolSize, filteredChampions.length)
    : 0
  const deckTargetCount = Math.max(championDeck.length, deckCapacityBase)
  const pendingDeckSlots = Math.max(deckTargetCount - championDeck.length, 0)

  const deckProgressLabel = `${championDeck.length}/${deckTargetCount}`
  const finalDeckReady =
    !isChampSpinning && deckTargetCount > 0 && championDeck.length === deckTargetCount
  const championsAvailable = filteredChampions.length > 0
  const spotlightMessage = !championsAvailable
    ? t("rollingStudio.champion.spotlight.noneAvailable")
    : isChampSpinning
      ? t("rollingStudio.champion.spotlight.generating", {
          current: Math.min(championDeck.length + 1, deckTargetCount),
          total: deckTargetCount,
        })
      : finalDeckReady
        ? t("rollingStudio.champion.spotlight.deckReady")
        : t("rollingStudio.champion.spotlight.prompt")

  // Role filter handlers
  const toggleRole = useCallback((role: Champion["role"]) => {
    setEnabledRoles((prev) => {
      const next = new Set(prev)
      if (next.has(role)) {
        if (next.size > 1) next.delete(role)
      } else {
        next.add(role)
      }
      return next
    })
  }, [])

  const selectAllRoles = useCallback(() => {
    setEnabledRoles(new Set(ALL_ROLES))
  }, [])

  const clearAllRoles = useCallback(() => {
    // Keep at least 1 role
    setEnabledRoles(new Set([ALL_ROLES[0]]))
  }, [])

  // Category handlers
  const toggleCategory = useCallback((categoryId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, enabled: !c.enabled } : c
      )
    )
  }, [])

  const enableAllCategories = useCallback(() => {
    setCategories((prev) => prev.map((c) => ({ ...c, enabled: true })))
  }, [])

  const disableAllCategories = useCallback(() => {
    setCategories((prev) => prev.map((c) => ({ ...c, enabled: false })))
  }, [])

  const clearRollQueue = useCallback(() => {
    rollSequenceRef.current = []
    rollQueueActiveRef.current = false
    if (rollQueueDelayRef.current) {
      clearTimeout(rollQueueDelayRef.current)
      rollQueueDelayRef.current = null
    }
  }, [])

  // Roll handlers
  const rollChampion = useCallback(
    (options?: { fromQueue?: boolean }) => {
      const fromQueue = options?.fromQueue ?? false
      if (!fromQueue) {
        clearRollQueue()
      }
      setActiveRollView("champion")
      if (isChampSpinning || filteredChampions.length === 0) return
      setIsChampSpinning(true)
      setChampionDeck([])
      setChampionSpotlight(null)

      const desiredCount = Math.min(championPoolSize, filteredChampions.length)
      if (desiredCount === 0) {
        setIsChampSpinning(false)
        return
      }

      const pool = [...filteredChampions]
      const picks: Champion[] = []
      for (let i = 0; i < desiredCount; i++) {
        const index = Math.floor(Math.random() * pool.length)
        picks.push(pool[index])
        pool.splice(index, 1)
      }

      let revealIndex = 0

      const revealNext = () => {
        if (revealIndex >= picks.length) {
          setChampionSpotlight(null)
          setIsChampSpinning(false)
          return
        }

        const champ = picks[revealIndex]
        const shuffleIterations = Math.min(6, Math.max(filteredChampions.length, 3))
        const shuffleDelay = 110
        let shuffleCount = 0

        const runShuffle = () => {
          if (shuffleCount < shuffleIterations) {
            const random = filteredChampions[Math.floor(Math.random() * filteredChampions.length)]
            setChampionSpotlight(random)
            shuffleCount += 1
            champTimeoutRef.current = setTimeout(runShuffle, shuffleDelay)
            return
          }

          setChampionSpotlight(champ)
          champTimeoutRef.current = setTimeout(() => {
            setChampionDeck((prev) => [...prev, champ])
            revealIndex += 1
            champTimeoutRef.current = setTimeout(() => {
              revealNext()
            }, 350)
          }, 600)
        }

        runShuffle()
      }

      if (champTimeoutRef.current) clearTimeout(champTimeoutRef.current)
      revealNext()
    },
    [championPoolSize, clearRollQueue, filteredChampions, isChampSpinning]
  )

  const rollRule = useCallback(
    (options?: { fromQueue?: boolean }) => {
      const fromQueue = options?.fromQueue ?? false
      if (!fromQueue) {
        clearRollQueue()
      }
      setActiveRollView("rule")
      if (isRuleSpinning || availableRules.length === 0) return
      setIsRuleSpinning(true)

      let delay = 60
      let flipCount = 0
      const totalFlips = 12

      const progressiveFlip = () => {
        if (flipCount >= totalFlips) {
          setIsRuleSpinning(false)
          return
        }
        const randomIndex = Math.floor(Math.random() * availableRules.length)
        setSelectedRule(availableRules[randomIndex])
        flipCount++
        delay += 30
        ruleTimeoutRef.current = setTimeout(progressiveFlip, delay)
      }

      if (ruleTimeoutRef.current) clearTimeout(ruleTimeoutRef.current)
      progressiveFlip()
    },
    [availableRules, clearRollQueue, isRuleSpinning]
  )

  const rollWinCondition = useCallback(
    (options?: { fromQueue?: boolean }) => {
      const fromQueue = options?.fromQueue ?? false
      if (!fromQueue) {
        clearRollQueue()
      }
      setActiveRollView("win")
      if (isWinSpinning || filteredWinConditions.length === 0) return
      setIsWinSpinning(true)

      let delay = 60
      let flipCount = 0
      const totalFlips = 10

      const progressiveFlip = () => {
        if (flipCount >= totalFlips) {
          setIsWinSpinning(false)
          return
        }
        const randomIndex = Math.floor(Math.random() * filteredWinConditions.length)
        setSelectedWinCondition(filteredWinConditions[randomIndex])
        flipCount++
        delay += 35
        winTimeoutRef.current = setTimeout(progressiveFlip, delay)
      }

      if (winTimeoutRef.current) clearTimeout(winTimeoutRef.current)
      progressiveFlip()
    },
    [clearRollQueue, filteredWinConditions, isWinSpinning]
  )

  const isAnySpinning = isChampSpinning || isRuleSpinning || isWinSpinning
  const noRulesAvailable = availableRules.length === 0
  const noWinConditionsAvailable = filteredWinConditions.length === 0
  const enabledCategoryCount = categories.filter((c) => c.enabled).length
  const totalWinConditions = winConditions.length
  const ruleAvailabilityMessage =
    enabledCategoryCount === 0
      ? t("rollingStudio.rule.availability.noCategory")
      : selectedMap
        ? t("rollingStudio.rule.availability.noMap")
        : t("rollingStudio.rule.availability.noCategory")
  const winConditionAvailabilityMessage = selectedMap
    ? t("rollingStudio.win.availability.noMap")
    : t("rollingStudio.win.availability.empty")
  const championCardVariant = isMobile ? "compact" : "standard"
  const localizedRuleCopy = useMemo(
    () => (selectedRule ? getLocalizedRuleContent(selectedRule, locale) : null),
    [selectedRule, locale]
  )

  const startQueuedRoll = useCallback(() => {
    if (!rollQueueActiveRef.current) return
    if (rollSequenceRef.current.length === 0) {
      rollQueueActiveRef.current = false
      if (rollQueueDelayRef.current) {
        clearTimeout(rollQueueDelayRef.current)
        rollQueueDelayRef.current = null
      }
      return
    }

    const next = rollSequenceRef.current[0]
    const schedule = (fn: () => void, delay: number) => {
      if (rollQueueDelayRef.current) {
        clearTimeout(rollQueueDelayRef.current)
      }
      rollQueueDelayRef.current = setTimeout(() => {
        rollQueueDelayRef.current = null
        fn()
      }, delay)
    }

    if (next === "champion" && !isChampSpinning) {
      rollSequenceRef.current.shift()
      schedule(() => rollChampion({ fromQueue: true }), 0)
      return
    }

    if (next === "rule" && !isChampSpinning && !isRuleSpinning) {
      rollSequenceRef.current.shift()
      schedule(() => rollRule({ fromQueue: true }), 350)
      return
    }

    if (
      next === "win" &&
      !isChampSpinning &&
      !isRuleSpinning &&
      !isWinSpinning
    ) {
      rollSequenceRef.current.shift()
      schedule(() => rollWinCondition({ fromQueue: true }), 350)
      return
    }
  }, [isChampSpinning, isRuleSpinning, isWinSpinning, rollChampion, rollRule, rollWinCondition])

  const rollAll = useCallback(() => {
    if (
      isAnySpinning ||
      !championsAvailable ||
      noRulesAvailable ||
      noWinConditionsAvailable
    ) {
      return
    }
    setSelectedRule(null)
    setSelectedWinCondition(null)
    clearRollQueue()
    rollQueueActiveRef.current = true
    rollSequenceRef.current = ["champion", "rule", "win"]
    startQueuedRoll()
  }, [championsAvailable, clearRollQueue, isAnySpinning, noRulesAvailable, noWinConditionsAvailable, startQueuedRoll])

  const reset = useCallback(() => {
    setChampionDeck([])
    setChampionSpotlight(null)
    setSelectedRule(null)
    setSelectedWinCondition(null)
    setSelectedMap(null)
    setActiveRollView("champion")
    clearRollQueue()
  }, [clearRollQueue])

  useEffect(() => {
    if (!selectedMap) return
    setSelectedRule((prev) =>
      prev && !prev.maps.includes(selectedMap) ? null : prev
    )
    setSelectedWinCondition((prev) =>
      prev && !prev.maps.includes(selectedMap) ? null : prev
    )
  }, [selectedMap])

  useEffect(() => {
    setChampionDeck((prev) =>
      prev.length > championPoolSize ? prev.slice(0, championPoolSize) : prev
    )
  }, [championPoolSize])

  useEffect(() => {
    if (!rollQueueActiveRef.current) return
    startQueuedRoll()
  }, [isChampSpinning, isRuleSpinning, isWinSpinning, startQueuedRoll])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (champTimeoutRef.current) clearTimeout(champTimeoutRef.current)
      if (ruleTimeoutRef.current) clearTimeout(ruleTimeoutRef.current)
      if (winTimeoutRef.current) clearTimeout(winTimeoutRef.current)
      if (rollQueueDelayRef.current) clearTimeout(rollQueueDelayRef.current)
    }
  }, [])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))]" />
          <p className="text-sm font-sans text-muted-foreground">
            {t("status.loadingChampions")}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (loadError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <span className="text-destructive text-xl">!</span>
          </div>
          <p className="text-sm font-sans text-muted-foreground">{loadError}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="font-sans"
          >
            {t("status.tryAgain")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[hsl(var(--primary))] flex items-center justify-center">
              <Sword className="w-4 h-4 text-[hsl(var(--primary-foreground))]" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-bold text-[hsl(var(--primary))] tracking-wide">
                {t("header.title")}
              </h1>
              <p className="text-xs text-muted-foreground font-sans">
                {t("header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-full border border-border bg-background/60 p-1" aria-label={t("language.switchHint")}>
              {LANGUAGE_OPTIONS.map((option) => {
                const isActive = locale === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setLocale(option.value)}
                    aria-pressed={isActive}
                    className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] rounded-full transition ${
                      isActive
                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(option.labelKey)}
                  </button>
                )
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="text-muted-foreground hover:text-foreground font-sans"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              {t("header.reset")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)] items-start">
          <div className="space-y-8 min-w-0">
            <section className="rounded-2xl border border-border bg-card/40 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-sans uppercase tracking-[0.35em] text-muted-foreground">
                    {t("rollingStudio.label")}
                  </p>
                  <h2 className="text-2xl font-serif font-semibold text-foreground">
                    {t("rollingStudio.title")}
                  </h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="inline-flex rounded-full border border-border bg-background/40 p-1">
                    {ROLL_VIEWS.map((view) => {
                      const isActive = activeRollView === view.id
                      return (
                        <button
                          key={view.id}
                          type="button"
                          onClick={() => setActiveRollView(view.id)}
                          className={`px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.25em] rounded-full transition ${
                            isActive
                              ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {t(view.labelKey)}
                        </button>
                      )
                    })}
                  </div>
                  <Button
                    onClick={rollAll}
                    disabled={
                      isAnySpinning ||
                      !championsAvailable ||
                      noRulesAvailable ||
                      noWinConditionsAvailable
                    }
                    variant="outline"
                    className="gap-2 border-[hsl(var(--primary))]/40 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10"
                  >
                    <Dices className="w-4 h-4" />
                    {t("rollingStudio.rollAll")}
                  </Button>
                </div>
              </div>

              {activeRollView === "champion" && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center min-h-[420px]">
                  <div className="flex flex-col items-center text-center gap-4 justify-center h-full">
                    <ChampionCard
                      champion={championSpotlight}
                      isSpinning={isChampSpinning}
                      variant={championCardVariant}
                    />
                    <p className="text-xs font-sans text-muted-foreground max-w-sm">
                      {spotlightMessage}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/40 p-5 space-y-3">
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground">
                        {t("rollingStudio.champion.rollTitle")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("rollingStudio.champion.description", { count: championPoolSize })}
                      </p>
                    </div>
                    <div className="text-[11px] font-sans text-muted-foreground flex items-center justify-between">
                      <span>{t("rollingStudio.champion.deckProgress")}</span>
                      <span>{deckProgressLabel}</span>
                    </div>
                    <Button
                      onClick={rollChampion}
                      disabled={isAnySpinning || !championsAvailable}
                      className="w-full gap-2 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90"
                    >
                      <Dices className="w-4 h-4" />
                      {isChampSpinning
                        ? t("rollingStudio.champion.buttonBusy")
                        : t("rollingStudio.champion.buttonIdle")}
                    </Button>
                  </div>
                </div>
              )}

              {activeRollView === "rule" && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center min-h-[420px]">
                  <div className="rounded-2xl border border-border bg-background/40 p-4 h-full flex flex-col">
                    <div className="h-[320px] overflow-y-auto pr-1">
                      <div className="flex justify-center">
                        <RuleCard rule={selectedRule} isSpinning={isRuleSpinning} />
                      </div>
                    </div>
                    {noRulesAvailable && (
                      <p className="mt-3 text-xs font-sans text-muted-foreground text-center">
                        {ruleAvailabilityMessage}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl border border-border bg-background/40 p-5 space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground">
                        {t("rollingStudio.rule.rollTitle")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("rollingStudio.rule.description")}
                      </p>
                    </div>
                    <Button
                      onClick={rollRule}
                      disabled={isAnySpinning || noRulesAvailable}
                      variant="secondary"
                      className="w-full gap-2"
                    >
                      <ScrollText className="w-4 h-4" />
                      {isRuleSpinning
                        ? t("rollingStudio.rule.buttonBusy")
                        : t("rollingStudio.rule.buttonIdle")}
                    </Button>
                  </div>
                </div>
              )}

              {activeRollView === "win" && (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center min-h-[420px]">
                  <div className="rounded-2xl border border-border bg-background/40 p-4 h-full flex flex-col">
                    <div className="h-[280px] overflow-y-auto pr-1">
                      <div className="flex justify-center">
                        <WinConditionCard
                          condition={selectedWinCondition}
                          isSpinning={isWinSpinning}
                        />
                      </div>
                    </div>
                    {noWinConditionsAvailable && (
                      <p className="mt-3 text-xs font-sans text-muted-foreground text-center">
                        {winConditionAvailabilityMessage}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl border border-border bg-background/40 p-5 space-y-4 h-full flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground">
                        {t("rollingStudio.win.rollTitle")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {t("rollingStudio.win.description")}
                      </p>
                    </div>
                    <Button
                      onClick={rollWinCondition}
                      disabled={isAnySpinning || noWinConditionsAvailable}
                      variant="secondary"
                      className="w-full gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      {isWinSpinning
                        ? t("rollingStudio.win.buttonBusy")
                        : t("rollingStudio.win.buttonIdle")}
                    </Button>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-border bg-card/40 p-6 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-sans uppercase tracking-[0.35em] text-muted-foreground">
                    {t("resultPool.label")}
                  </p>
                  <h3 className="text-xl font-serif font-semibold">{t("resultPool.title")}</h3>
                </div>
                <span className="text-xs font-sans text-muted-foreground">
                  {t("resultPool.optionsGenerated", {
                    current: championDeck.length,
                    total: championPoolSize,
                  })}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {championDeck.map((champion, index) => (
                  <div
                    key={`${champion.id}-${index}`}
                    className="rounded-xl border border-border bg-background/50 p-4 space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <ChampionCard
                        champion={champion}
                        isSpinning={false}
                        variant="compact"
                      />
                      <div className="flex-1 space-y-3 text-sm">
                        <div>
                          <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground">
                            {t("resultPool.ruleLabel")}
                          </p>
                          {localizedRuleCopy ? (
                            <div>
                              <p className="font-semibold text-foreground">{localizedRuleCopy.name}</p>
                              <p className="text-xs text-muted-foreground leading-snug max-h-12 overflow-hidden">
                                {localizedRuleCopy.description}
                              </p>
                            </div>
                          ) : (
                            <p className="text-xs text-muted-foreground">{t("resultPool.awaiting")}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-[11px] font-sans uppercase tracking-[0.3em] text-muted-foreground">
                            {t("resultPool.winLabel")}
                          </p>
                          <p className="text-xs text-muted-foreground">{t("resultPool.winHelper")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {pendingDeckSlots > 0 &&
                  Array.from({ length: pendingDeckSlots }).map((_, index) => (
                    <div
                      key={`pending-slot-${index}`}
                      className="rounded-xl border-2 border-dashed border-border/60 bg-background/20 p-4 flex flex-col items-center justify-center text-center text-sm text-muted-foreground gap-2"
                    >
                      <ChampionCard
                        champion={null}
                        isSpinning={isChampSpinning}
                        variant="compact"
                      />
                      <p>{t("resultPool.pending")}</p>
                    </div>
                  ))}
              </div>

              <div className="rounded-2xl border border-border bg-background/40 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-sans uppercase tracking-[0.35em] text-muted-foreground">
                      {t("resultPool.globalPanel.label")}
                    </p>
                    <h4 className="text-lg font-serif font-semibold">{t("resultPool.globalPanel.title")}</h4>
                  </div>
                  <span className="text-xs font-sans text-muted-foreground">
                    {selectedWinCondition
                      ? t("resultPool.globalPanel.synced")
                      : t("resultPool.globalPanel.waiting")}
                  </span>
                </div>
                <div className="rounded-xl border border-border/60 bg-card/30 p-4 flex items-center justify-center">
                  {selectedWinCondition ? (
                    <WinConditionCard
                      condition={selectedWinCondition}
                      isSpinning={isWinSpinning}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground text-center">
                      {t("resultPool.globalPanel.prompt")}
                    </p>
                  )}
                </div>
              </div>

              {championDeck.length === 0 && !isChampSpinning && (
                <p className="text-sm text-muted-foreground text-center">
                  {t("resultPool.empty")}
                </p>
              )}
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 min-w-0">
            <div className="rounded-2xl border border-border bg-card/40 p-4 space-y-4">
              <MapSelector
                selectedMap={selectedMap}
                onSelectMap={setSelectedMap}
                ruleCount={availableRules.length}
                winConditionCount={filteredWinConditions.length}
              />
              <div className="rounded-xl border border-border/50 bg-background/40 p-4 text-xs font-sans text-muted-foreground flex flex-wrap justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">
                    {filteredChampions.length}
                  </span>
                  <span>{t("sidebar.stats.champions")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">
                    {enabledRoles.size}
                  </span>
                  <span>{t("sidebar.stats.roles")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[hsl(var(--primary))] font-semibold">
                    {enabledCategoryCount}
                  </span>
                  <span>{t("sidebar.stats.categories")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[hsl(var(--accent))] font-semibold">
                    {availableRules.length}
                  </span>
                  <span>{t("sidebar.stats.rules")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">
                    {filteredWinConditions.length}
                  </span>
                  <span title={t("sidebar.stats.totalWins", { total: totalWinConditions })}>
                    {t("sidebar.stats.wins")}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/40 p-4">
              <Accordion type="multiple" defaultValue={["roles"]} className="space-y-2">
                <AccordionItem value="roles" className="border-border/60">
                  <AccordionTrigger className="text-sm font-semibold">
                    {t("sidebar.accordions.roles")} · {enabledRoles.size}/{ALL_ROLES.length}
                  </AccordionTrigger>
                  <AccordionContent>
                    <RoleFilter
                      enabledRoles={enabledRoles}
                      onToggleRole={toggleRole}
                      onSelectAll={selectAllRoles}
                      onClearAll={clearAllRoles}
                      filteredCount={filteredChampions.length}
                      totalCount={champions.length}
                    />
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="categories" className="border-border/60">
                  <AccordionTrigger className="text-sm font-semibold">
                    {t("sidebar.accordions.categories")} · {enabledCategoryCount}
                  </AccordionTrigger>
                  <AccordionContent>
                    <CategoryToggles
                      categories={categories}
                      onToggle={toggleCategory}
                      onEnableAll={enableAllCategories}
                      onDisableAll={disableAllCategories}
                      totalEnabledRules={availableRules.length}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="rounded-2xl border border-border bg-card/40 p-4">
              <div className="flex items-center justify-between text-[11px] font-sans text-muted-foreground mb-2">
                <span>{t("sidebar.championOptions.label")}</span>
                <span>{championPoolSize}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {CHAMPION_POOL_OPTIONS.map((count) => {
                  const isActive = championPoolSize === count
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setChampionPoolSize(count)}
                      aria-pressed={isActive}
                      className={`rounded-md border px-2 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] ${
                        isActive
                          ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                          : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
                      }`}
                    >
                      {count}
                    </button>
                  )
                })}
              </div>
              <p className="mt-2 text-[11px] font-sans text-muted-foreground text-center">
                {t("sidebar.championOptions.helper")}
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
