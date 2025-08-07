import { apiGetMenu, apiRecognizeMenu, apiSaveFullMenu } from '@/api/menu'
import type { DBDish, DishByIdMap } from '@/types/menu'
import { ValidationError } from '@/utils/errors'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'

export type MenuError =
	| { type: 'validation'; message: string; invalidIds: string[] }
	| { type: 'server'; message: string }
	| { type: 'ocr'; message: string }

type MenuStore = {
	initialDishes: DishByIdMap
	editedDishes: Partial<Record<string, Partial<DBDish> | null>> // только изменения

	isEditing: boolean

	loading: boolean
	loadingOcr: boolean
	saving: boolean

	error: MenuError | null
	setError: (newError: null | MenuError) => void

	loadMenuFromServer: () => Promise<void>
	saveMenuToServer: () => Promise<void>

	getDish: (id: string) => DBDish | undefined

	updateDishLocally: (id: string, changes: Partial<DBDish>) => void
	removeFromEdited: (id: string) => void
	addDishLocally: (dish: DBDish) => void
	removeDishLocally: (id: string) => void
	recognizeAndAppendMenu: (file: File) => Promise<void>

	startEditing: () => void
	stopEditing: () => void
	reset: () => void
}

export const menuStore = createStore(
	persist<MenuStore>(
		(set, get) => ({
			initialDishes: {},
			editedDishes: {},

			isEditing: false,
			loading: false,
			loadingOcr: false,
			saving: false,

			error: null,

			loadMenuFromServer: async () => {
				set({ loading: true })
				try {
					const serverDishes = await apiGetMenu()
					const map = Object.fromEntries(
						serverDishes.map(d => [d.index, d])
					)
					set({ initialDishes: map })
				} catch (err) {
					console.error('Ошибка при загрузке меню', err)
				} finally {
					set({ loading: false })
				}
			},

			saveMenuToServer: async () => {
				set({ error: null })
				set({ saving: true })
				try {
					const { initialDishes, editedDishes } = get()

					const allIds = new Set([
						...Object.keys(initialDishes),
						...Object.keys(editedDishes),
					])

					const toDelete: string[] = []
					const toUpsert: any[] = []
					const invalidIds: string[] = []

					for (const id of allIds) {
						const patch = editedDishes[id]

						if (patch === null) {
							toDelete.push(id)
						} else {
							const base = initialDishes[id] || {}
							const merged = { ...base, ...patch }

							// Валидация обязательных полей
							const requiredFields: (keyof typeof merged)[] = [
								'title',
								'price',
							]
							const hasMissing = requiredFields.some(
								field => !merged[field] && merged[field] !== 0
							)

							if (hasMissing) {
								invalidIds.push(id)
								continue
							}

							toUpsert.push(merged)
						}
					}

					if (invalidIds.length > 0) {
						set({
							error: {
								type: 'validation',
								message:
									'Заполните обязательные поля перед сохранением.',
								invalidIds,
							},
						})
						throw new ValidationError()
					}

					await apiSaveFullMenu(toUpsert)

					const newInitial = Object.fromEntries(
						toUpsert.map(d => [d.index, d])
					)
					set({ initialDishes: newInitial, editedDishes: {} })
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
					editedDishes: {
						...state.editedDishes,
						[dish.index]: dish,
					},
				}))
			},

			removeDishLocally: id => {
				set(state => {
					const edited = { ...state.editedDishes }
					edited[id] = null
					return {
						editedDishes: edited,
					}
				})
			},

			removeFromEdited: id => {
				set(state => {
					const edited = { ...state.editedDishes }
					delete edited[id]
					return {
						editedDishes: edited,
					}
				})
			},

			recognizeAndAppendMenu: async (file: File) => {
				set({ loadingOcr: true })
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
					set({ loadingOcr: false })
				}
			},

			setError: newError => set({ error: newError }),

			startEditing: () => {
				set({ isEditing: true, error: null })
			},
			stopEditing: () => set({ isEditing: false, error: null }),

			reset: () => {
				set({ editedDishes: {} })
			},
		}),
		{ name: 'menu-storage' }
	)
)
