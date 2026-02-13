"use client"

import { useState, useCallback, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChampionCard } from "@/components/champion-card"
import { RuleCard } from "@/components/rule-card"
import { WinConditionCard } from "@/components/win-condition-card"
import { CategoryToggles } from "@/components/category-toggles"
import { RoleFilter } from "@/components/role-filter"
import { MapSelector } from "@/components/map-selector"
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

const ALL_ROLES: Champion["role"][] = [
  "Fighter",
  "Mage",
  "Assassin",
  "Marksman",
  "Support",
  "Tank",
]

const CHAMPION_POOL_OPTIONS = [1, 2, 3, 4, 5] as const

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

  const champTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const ruleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const winTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    ? "No champions available with the current role filters."
    : isChampSpinning
      ? `Generating champion ${Math.min(championDeck.length + 1, deckTargetCount)} / ${deckTargetCount}`
      : finalDeckReady
        ? "Deck ready! Roll again to reshuffle."
        : "Roll Champion to populate your deck."

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

  // Roll handlers
  const rollChampion = useCallback(() => {
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
  }, [isChampSpinning, filteredChampions, championPoolSize])

  const rollRule = useCallback(() => {
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
  }, [isRuleSpinning, availableRules])

  const rollWinCondition = useCallback(() => {
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
  }, [isWinSpinning, filteredWinConditions])

  const rollAll = useCallback(() => {
    rollChampion()
    setTimeout(() => rollRule(), 200)
    setTimeout(() => rollWinCondition(), 400)
  }, [rollChampion, rollRule, rollWinCondition])

  const reset = useCallback(() => {
    setChampionDeck([])
    setChampionSpotlight(null)
    setSelectedRule(null)
    setSelectedWinCondition(null)
    setSelectedMap(null)
  }, [])

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

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (champTimeoutRef.current) clearTimeout(champTimeoutRef.current)
      if (ruleTimeoutRef.current) clearTimeout(ruleTimeoutRef.current)
      if (winTimeoutRef.current) clearTimeout(winTimeoutRef.current)
    }
  }, [])

  const isAnySpinning = isChampSpinning || isRuleSpinning || isWinSpinning
  const noRulesAvailable = availableRules.length === 0
  const noWinConditionsAvailable = filteredWinConditions.length === 0
  const enabledCategoryCount = categories.filter((c) => c.enabled).length
  const totalWinConditions = winConditions.length
  const ruleAvailabilityMessage =
    enabledCategoryCount === 0
      ? "Enable at least one rule category"
      : selectedMap
        ? "No rules available for this map. Adjust filters or switch maps."
        : "Enable at least one rule category"
  const winConditionAvailabilityMessage = selectedMap
    ? "No win conditions available on this map. Try another map."
    : "No win conditions available. Add more to the pool."

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--primary))]" />
          <p className="text-sm font-sans text-muted-foreground">
            Loading champions from Data Dragon...
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
            Try Again
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
                Champion Roulette
              </h1>
              <p className="text-xs text-muted-foreground font-sans">
                1v1 Randomizer Tool
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="text-muted-foreground hover:text-foreground font-sans"
          >
            <RotateCcw className="w-4 h-4 mr-1.5" />
            Reset
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 lg:py-12">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
          <Button
            onClick={rollChampion}
            disabled={isAnySpinning || filteredChampions.length === 0}
            className="w-full sm:w-auto bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 font-sans font-semibold"
            size="lg"
          >
            <Dices className="w-4 h-4 mr-2" />
            {isChampSpinning ? "Rolling..." : "Roll Champion"}
          </Button>
          <Button
            onClick={rollRule}
            disabled={isAnySpinning || noRulesAvailable}
            variant="secondary"
            className="w-full sm:w-auto font-sans font-semibold"
            size="lg"
            title={noRulesAvailable ? ruleAvailabilityMessage : undefined}
          >
            <ScrollText className="w-4 h-4 mr-2" />
            {isRuleSpinning ? "Rolling..." : "Roll Rule"}
          </Button>
          <Button
            onClick={rollWinCondition}
            disabled={isAnySpinning || noWinConditionsAvailable}
            variant="secondary"
            className="w-full sm:w-auto font-sans font-semibold"
            size="lg"
            title={
              noWinConditionsAvailable ? winConditionAvailabilityMessage : undefined
            }
          >
            <Trophy className="w-4 h-4 mr-2" />
            {isWinSpinning ? "Rolling..." : "Roll Win Condition"}
          </Button>
          <Button
            onClick={rollAll}
            disabled={
              isAnySpinning || noRulesAvailable || noWinConditionsAvailable
            }
            variant="outline"
            className="w-full sm:w-auto font-sans font-semibold border-[hsl(var(--primary))]/30 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 hover:text-[hsl(var(--primary))]"
            size="lg"
            title={
              noRulesAvailable || noWinConditionsAvailable
                ? "Some rolls are unavailable with the current map or categories."
                : undefined
            }
          >
            <Dices className="w-4 h-4 mr-2" />
            Roll All
          </Button>
        </div>

        <div className="mb-10">
          <MapSelector
            selectedMap={selectedMap}
            onSelectMap={setSelectedMap}
            ruleCount={availableRules.length}
            winConditionCount={filteredWinConditions.length}
          />
        </div>

        {/* Cards Grid -- 3 columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Champion Section */}
          <section className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-8 bg-border" />
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">
                Champion
              </h2>
              <div className="h-px w-8 bg-border" />
            </div>
            <div className="w-full flex flex-col items-center gap-6">
              <div className="w-full max-w-sm flex flex-col items-center gap-3">
                <ChampionCard
                  champion={championSpotlight}
                  isSpinning={isChampSpinning}
                />
                <p className="text-xs font-sans text-muted-foreground text-center">
                  {spotlightMessage}
                </p>
              </div>

              <div className="w-full">
                <div className="flex items-center justify-between text-[11px] font-sans text-muted-foreground mb-2">
                  <span>Deck Progress</span>
                  <span>{deckProgressLabel}</span>
                </div>
                <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
                  {championDeck.map((champion) => (
                    <ChampionCard
                      key={champion.id}
                      champion={champion}
                      isSpinning={false}
                      variant="compact"
                    />
                  ))}
                  {Array.from({ length: pendingDeckSlots }).map((_, index) => (
                    <ChampionCard
                      key={`deck-placeholder-${index}`}
                      champion={null}
                      isSpinning={isChampSpinning}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>

              <div className="w-full max-w-sm">
                <div className="flex items-center justify-between text-[11px] font-sans text-muted-foreground mb-2">
                  <span>Champion Options</span>
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
                  Choose how many random champions to roll at once.
                </p>
              </div>
            </div>

            {/* Role Filter */}
            <div className="mt-2 w-full flex justify-center">
              <RoleFilter
                enabledRoles={enabledRoles}
                onToggleRole={toggleRole}
                onSelectAll={selectAllRoles}
                onClearAll={clearAllRoles}
                filteredCount={filteredChampions.length}
                totalCount={champions.length}
              />
            </div>
          </section>

          {/* Rule Section */}
          <section className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-8 bg-border" />
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">
                1v1 Rule
              </h2>
              <div className="h-px w-8 bg-border" />
            </div>
            <RuleCard rule={selectedRule} isSpinning={isRuleSpinning} />

            {noRulesAvailable && (
              <p className="text-xs font-sans text-muted-foreground text-center">
                {ruleAvailabilityMessage}
              </p>
            )}

            {/* Category Toggles */}
            <div className="mt-2 w-full flex justify-center">
              <CategoryToggles
                categories={categories}
                onToggle={toggleCategory}
                onEnableAll={enableAllCategories}
                onDisableAll={disableAllCategories}
                totalEnabledRules={availableRules.length}
              />
            </div>
          </section>

          {/* Win Condition Section */}
          <section className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-px w-8 bg-border" />
              <h2 className="text-xs font-sans uppercase tracking-[0.2em] text-muted-foreground">
                Win Condition
              </h2>
              <div className="h-px w-8 bg-border" />
            </div>
            <WinConditionCard
              condition={selectedWinCondition}
              isSpinning={isWinSpinning}
            />
            <p className="text-xs font-sans text-muted-foreground text-center">
              {selectedMap
                ? `${filteredWinConditions.length} win conditions for this map`
                : `${filteredWinConditions.length} win conditions available`}
            </p>
            {noWinConditionsAvailable && (
              <p className="text-xs font-sans text-muted-foreground text-center">
                {winConditionAvailabilityMessage}
              </p>
            )}
          </section>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 rounded-lg border border-border bg-card/50 p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-sans text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">
                {filteredChampions.length}
              </span>
              <span>Champions</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">
                {enabledRoles.size}
              </span>
              <span>Roles</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-[hsl(var(--primary))] font-semibold">
                {enabledCategoryCount}
              </span>
              <span>Categories</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-[hsl(var(--accent))] font-semibold">
                {availableRules.length}
              </span>
              <span>Rules</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-foreground font-semibold">
                {filteredWinConditions.length}
              </span>
              <span title={`Total pool: ${totalWinConditions}`}>
                Win Conditions
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
