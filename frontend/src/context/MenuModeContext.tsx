import { createContext, useContext, useState } from 'react'
import { loadIsCatering, saveIsCatering } from '../storage/menuMode'
interface MenuModeContextType {
	isCatering: boolean
	toggleIsCatering: () => void
	setIsCatering: (value: boolean) => void
}
const MenuModeContext = createContext<MenuModeContextType | undefined>(
	undefined,
)

export const MenuModeProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [isCatering, setIsCateringMode] = useState(() => {
		const stored = loadIsCatering()
		return stored !== null ? stored : false
	})

	const saveAndSet = (value: boolean) => {
		setIsCateringMode(value)
		saveIsCatering(value)
	}

	const toggleIsCatering = () => {
		saveAndSet(!isCatering)
	}

	const setIsCatering = (value: boolean) => {
		setIsCateringMode(value)
		saveAndSet(value)
	}

	return (
		<MenuModeContext.Provider
			value={{ isCatering, toggleIsCatering, setIsCatering }}
		>
			{children}
		</MenuModeContext.Provider>
	)
}

export const useMenuMode = () => {
	const context = useContext(MenuModeContext)
	if (!context) {
		throw new Error('useMenuMode must be used within a MenuModeProvider')
	}
	return context
}
