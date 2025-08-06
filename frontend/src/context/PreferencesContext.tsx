import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { loadPreferences, savePreferences } from '../storage/preferences'
import type { Preferences } from '../types/preferences'

type PreferencesContextType = {
	preferences: Preferences
	togglePreference: (key: keyof Preferences) => void
	setPreferences: (prefs: Partial<Preferences>) => void
	clearPreferences: () => void
}

const defaultPreferences: Preferences = {
	glutenFree: false,
	lactoseFree: false,
	vegan: false,
	vegetarian: false,
	spicy: false,
	nutsFree: false,
	sugarFree: false,
	halal: false,
	kosher: false,
	soyFree: false,
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(
	undefined,
)

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
	const [preferences, setPreferencesState] =
		useState<Preferences>(defaultPreferences)

	useEffect(() => {
		const stored = loadPreferences()
		if (stored) {
			setPreferencesState(stored)
		}
	}, [])

	const saveAndSetPreferences = (prefs: Preferences) => {
		setPreferencesState(prefs)
		savePreferences(prefs)
	}

	const togglePreference = (key: keyof Preferences) => {
		const newPrefs = {
			...preferences,
			[key]: !preferences[key],
		}

		saveAndSetPreferences(newPrefs)
	}

	const setPreferences = (prefs: Partial<Preferences>) => {
		const newPrefs = {
			...preferences,
			...prefs,
		}
		saveAndSetPreferences(newPrefs)
	}

	const clearPreferences = () => {
		setPreferencesState(defaultPreferences)
		savePreferences(defaultPreferences)
	}

	return (
		<PreferencesContext.Provider
			value={{
				preferences,
				togglePreference,
				setPreferences,
				clearPreferences,
			}}
		>
			{children}
		</PreferencesContext.Provider>
	)
}

export const usePreferences = (): PreferencesContextType => {
	const context = useContext(PreferencesContext)
	if (!context)
		throw new Error(
			'usePreferences must be used within PreferencesProvider',
		)
	return context
}
