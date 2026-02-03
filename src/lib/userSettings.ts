'use client'

// User settings storage for personalization

export interface UserSettings {
  name: string
  hasCompletedOnboarding: boolean
  createdAt: string
}

const SETTINGS_KEY = 'math-app-user-settings'

const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  hasCompletedOnboarding: false,
  createdAt: ''
}

// Load user settings from localStorage
export function loadUserSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_SETTINGS, ...parsed }
    }
  } catch (e) {
    console.error('Failed to load user settings:', e)
  }
  
  return DEFAULT_SETTINGS
}

// Save user settings
export function saveUserSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error('Failed to save user settings:', e)
  }
}

// Set user name and mark onboarding as complete
export function completeOnboarding(name: string): UserSettings {
  const settings: UserSettings = {
    name: name.trim(),
    hasCompletedOnboarding: true,
    createdAt: new Date().toISOString()
  }
  saveUserSettings(settings)
  return settings
}

// Update user name
export function updateUserName(name: string): void {
  const settings = loadUserSettings()
  settings.name = name.trim()
  saveUserSettings(settings)
}

// Check if onboarding is complete
export function isOnboardingComplete(): boolean {
  const settings = loadUserSettings()
  return settings.hasCompletedOnboarding && settings.name.length > 0
}

// Get user name (defaults to empty if not set)
export function getUserName(): string {
  const settings = loadUserSettings()
  return settings.name
}
