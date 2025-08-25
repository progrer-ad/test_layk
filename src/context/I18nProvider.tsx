'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import i18n from '@/lib/i18n'
import Cookies from 'js-cookie'

type I18nContextType = {
  language: string
  changeLanguage: (lng: string) => void
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  changeLanguage: () => {},
})

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<string | null>(null)

  useEffect(() => {
    const cookieLang = Cookies.get('lang') || 'en'
    i18n.changeLanguage(cookieLang)
    setLanguage(cookieLang)
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLanguage(lng)
    Cookies.set('lang', lng, { expires: 365 }) 
  }

  // Cookie o‘qilguncha hech narsa render qilmaymiz
  if (!language) return null 

  return (
    <I18nContext.Provider value={{ language, changeLanguage }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => useContext(I18nContext)
