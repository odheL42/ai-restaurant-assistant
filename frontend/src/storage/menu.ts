import { apiGetMenu, apiRecognizeMenu, apiSaveFullMenu } from '@/api/menu'
import type { DBDish, DishByIdMap } from '@/types/menu'
import { createStore } from 'zustand'

type MenuStore = {
	initialDishes: DishByIdMap
	editedDishes: Partial<Record<string, Partial<DBDish>>> // только изменения

	isEditing: boolean

	loading: boolean
	saving: boolean

	loadMenuFromServer: () => Promise<void>
	saveMenuToServer: () => Promise<void>

	getDish: (id: string) => DBDish | undefined

	updateDishLocally: (id: string, changes: Partial<DBDish>) => void
	addDishLocally: (dish: DBDish) => void
	removeDishLocally: (id: string) => void
	recognizeAndAppendMenu: (file: File) => Promise<void>

	startEditing: () => void
	stopEditing: () => void
	reset: () => void
}

export const menuStore = createStore<MenuStore>((set, get) => ({
	initialDishes: {},
	editedDishes: {},

	isEditing: false,
	loading: false,
	saving: false,

	loadMenuFromServer: async () => {
		set({ loading: true })
		try {
			const serverDishes = await apiGetMenu()
			const map = Object.fromEntries(serverDishes.map(d => [d.index, d]))
			set({ initialDishes: map })
		} catch (err) {
			console.error('Ошибка при загрузке меню', err)
		} finally {
			set({ loading: false })
		}
	},

	saveMenuToServer: async () => {
		set({ saving: true })
		try {
			const { initialDishes, editedDishes } = get()

			// Получаем все уникальные id (из initial и edited)
			const allIds = new Set([
				...Object.keys(initialDishes),
				...Object.keys(editedDishes),
			])

			// Мержим по всем id
			const merged = Array.from(allIds).map(id => {
				const base = initialDishes[id] || {}
				const patch = editedDishes[id] || {}
				return { ...base, ...patch }
			})

			await apiSaveFullMenu(merged)

			// Обновляем initial после успешного сохранения
			const newInitial = Object.fromEntries(merged.map(d => [d.index, d]))
			set({ initialDishes: newInitial, editedDishes: {} })
		} catch (err) {
			console.error('Ошибка при сохранении меню', err)
		} finally {
			set({ saving: false })
		}
	},

	getDish: id => {
		const { initialDishes, editedDishes } = get()
		const base = initialDishes[id]
		if (!base) return undefined
		return { ...base, ...(editedDishes[id] || {}) }
	},

	updateDishLocally: (id, changes) => {
		set(state => ({
			editedDishes: {
				...state.editedDishes,
				[id]: { ...state.editedDishes[id], ...changes },
			},
		}))
	},

	addDishLocally: dish => {
		set(state => ({
			initialDishes: {
				...state.initialDishes,
				[dish.index]: dish,
			},
		}))
	},

	removeDishLocally: id => {
		set(state => {
			const initial = { ...state.initialDishes }
			const edited = { ...state.editedDishes }
			delete initial[id]
			delete edited[id]
			return {
				initialDishes: initial,
				editedDishes: edited,
			}
		})
	},

	recognizeAndAppendMenu: async (file: File) => {
		set({ loading: true })
		try {
			const recognized = await apiRecognizeMenu(file)

			set(state => {
				const newEdited = { ...state.editedDishes }
				for (const dish of recognized) {
					newEdited[dish.index] = dish
				}
				return { editedDishes: newEdited }
			})
		} catch (err) {
			console.error('Ошибка при распознавании меню', err)
		} finally {
			set({ loading: false })
		}
	},

	startEditing: () => set({ isEditing: true }),
	stopEditing: () => set({ isEditing: false }),

	reset: () => {
		set({ editedDishes: {} })
	},
}))
