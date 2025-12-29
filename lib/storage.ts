'use client'

import { useState, useEffect, useCallback } from 'react'

// Types for storage
export interface SavedInput {
  id: string
  name: string
  resume: string
  jobDescription: string
  createdAt: string
}

export interface Question {
  question: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  modelAnswer: string
  keyPoints: string[]
  followUps: string[]
}

export interface PrepPlanData {
  topicsToRevise: string[]
  timeline: string
  resources: string[]
}

export interface SkillGapAnalysisData {
  strengths: string[]
  gaps: string[]
  recommendations: string
}

export interface SavedHistory {
  id: string
  name: string
  resume: string
  jobDescription: string
  result: {
    questions: Question[]
    prepPlan: PrepPlanData
    skillGapAnalysis: SkillGapAnalysisData
  }
  createdAt: string
}

const STORAGE_KEYS = {
  SAVED_INPUTS: 'hireprep_saved_inputs',
  HISTORY: 'hireprep_history',
  LAST_INPUT: 'hireprep_last_input',
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Hook for managing saved inputs (resume + JD pairs)
export function useSavedInputs() {
  const [savedInputs, setSavedInputs] = useState<SavedInput[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVED_INPUTS)
    if (stored) {
      try {
        setSavedInputs(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse saved inputs:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  const saveInput = useCallback((resume: string, jobDescription: string, name?: string) => {
    const newInput: SavedInput = {
      id: generateId(),
      name: name || `Saved ${new Date().toLocaleDateString()}`,
      resume,
      jobDescription,
      createdAt: new Date().toISOString(),
    }

    setSavedInputs((prev) => {
      const updated = [newInput, ...prev]
      localStorage.setItem(STORAGE_KEYS.SAVED_INPUTS, JSON.stringify(updated))
      return updated
    })

    return newInput
  }, [])

  const deleteInput = useCallback((id: string) => {
    setSavedInputs((prev) => {
      const updated = prev.filter((input) => input.id !== id)
      localStorage.setItem(STORAGE_KEYS.SAVED_INPUTS, JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateInput = useCallback((id: string, updates: Partial<SavedInput>) => {
    setSavedInputs((prev) => {
      const updated = prev.map((input) =>
        input.id === id ? { ...input, ...updates } : input
      )
      localStorage.setItem(STORAGE_KEYS.SAVED_INPUTS, JSON.stringify(updated))
      return updated
    })
  }, [])

  return { savedInputs, saveInput, deleteInput, updateInput, isLoaded }
}

// Hook for managing prep history
export function useHistory() {
  const [history, setHistory] = useState<SavedHistory[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.HISTORY)
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse history:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  const saveToHistory = useCallback((
    resume: string,
    jobDescription: string,
    result: SavedHistory['result'],
    name?: string
  ) => {
    const newHistory: SavedHistory = {
      id: generateId(),
      name: name || `Prep ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
      resume,
      jobDescription,
      result,
      createdAt: new Date().toISOString(),
    }

    setHistory((prev) => {
      const updated = [newHistory, ...prev]
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated))
      return updated
    })

    return newHistory
  }, [])

  const deleteFromHistory = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const updateHistory = useCallback((id: string, updates: Partial<SavedHistory>) => {
    setHistory((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem(STORAGE_KEYS.HISTORY)
  }, [])

  return { history, saveToHistory, deleteFromHistory, updateHistory, clearHistory, isLoaded }
}

// Hook for auto-saving last input
export function useLastInput() {
  const [lastInput, setLastInput] = useState<{ resume: string; jobDescription: string } | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.LAST_INPUT)
    if (stored) {
      try {
        setLastInput(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse last input:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  const saveLastInput = useCallback((resume: string, jobDescription: string) => {
    const data = { resume, jobDescription }
    setLastInput(data)
    localStorage.setItem(STORAGE_KEYS.LAST_INPUT, JSON.stringify(data))
  }, [])

  const clearLastInput = useCallback(() => {
    setLastInput(null)
    localStorage.removeItem(STORAGE_KEYS.LAST_INPUT)
  }, [])

  return { lastInput, saveLastInput, clearLastInput, isLoaded }
}
