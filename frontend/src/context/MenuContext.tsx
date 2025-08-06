import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'

import type { DishByIdMap, MenuStructure } from '../types/menu'

import { apiGetMenu } from '../api/api'
import { useMenuMode } from './MenuModeContext'
import { toMenuData } from '../utils/menu'

type MenuContextValue = {
	menuStructure: MenuStructure | null
	dishById: DishByIdMap | null
	loading: boolean
	refetch: () => void
}

const MenuContext = createContext<MenuContextValue | null>(null)

export function MenuProvider({ children }: { children: ReactNode }) {
	const [menuStructure, setMenuStructure] = useState<MenuStructure | null>(
		null,
	)
	const [dishById, setDishById] = useState<DishByIdMap | null>(null)
	const [loading, setLoading] = useState(true)
	const { isCatering } = useMenuMode()

	const fetchMenu = async () => {
		setLoading(true)
		const rawMenu = await apiGetMenu(isCatering)
		const { menuStructure, dishById } = toMenuData(rawMenu)
		setMenuStructure(menuStructure)
		setDishById(dishById)
		setLoading(false)
	}

	useEffect(() => {
		fetchMenu()
	}, [isCatering])

	return (
		<MenuContext.Provider value={{ menuStructure, dishById, loading, refetch: fetchMenu }}>
			{children}
		</MenuContext.Provider>
	)
}

export const useMenu = () => {
	const ctx = useContext(MenuContext)
	if (!ctx) throw new Error('useMenu must be used within <MenuProvider>')
	return ctx
}
