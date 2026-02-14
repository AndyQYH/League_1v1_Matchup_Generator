"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { Locale, TranslationKey } from "@/lib/i18n"
import { translate } from "@/lib/i18n"

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh")

  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>) =>
      translate(locale, key, vars),
    [locale]
  )

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
    }
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, t]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
