'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { StoreData,Category } from '@/lib/api'

interface LayoutContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  storeData: StoreData
  categories:  Category[]
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

export function useLayout() {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

interface LayoutProviderProps {
  children: ReactNode
  storeData: StoreData
  categories: Category[]
}

export function LayoutProvider({ children, storeData, categories }: LayoutProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <LayoutContext.Provider value={{
      sidebarOpen,
      setSidebarOpen,
      storeData,
      categories
    }}>
      {children}
    </LayoutContext.Provider>
  )
}