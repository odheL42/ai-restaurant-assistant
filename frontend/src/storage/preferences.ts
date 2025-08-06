import type { Preferences } from '../types/preferences'

const LOCAL_STORAGE_KEY = 'user_preferences'

export const savePreferences = (preferences: Preferences): void => {
	try {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(preferences))
	} catch (e) {
		console.error(e)
	}
}

export const loadPreferences = (): Preferences | null => {
	try {
		const stored = localStorage.getItem(LOCAL_STORAGE_KEY)
		if (!stored) return null
		return JSON.parse(stored) as Preferences
	} catch (e) {
		console.error(e)
		return null
	}
}
