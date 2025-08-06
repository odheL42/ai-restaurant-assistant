import type { DBDish, DishByIdMap, MenuStructure } from '../types/menu'

export function toMenuData(dishes: DBDish[]): {
	menuStructure: MenuStructure
	dishById: DishByIdMap
} {
	const menuStructure = {} as MenuStructure
	const dishById: DishByIdMap = {}

	for (const dish of dishes) {
		const { index, context, category } = dish

		// Add dish to map
		dishById[index] = dish

		// Initialize context if needed
		if (!menuStructure[context]) {
			menuStructure[context] = {}
		}

		// Initialize category if needed
		if (!menuStructure[context][category]) {
			menuStructure[context][category] = []
		}

		menuStructure[context][category]!.push(dish)
	}

	return { menuStructure, dishById }
}

export function extractDishIdsFromMessage(message: string): {
	cleanedMessage: string
	dishIds: string[]
} {
	const dishIds: string[] = []

	// 1. Вытаскиваем ID из обёрток
	const patterns: RegExp[] = [
		/<R>(.*?)<\/R>/g,
		/\[(.*?)\]/g,
		/["“«](.*?)["”»]/g,
		/'(.*?)'/g,
		/`{1,3}(.*?)`{1,3}/g, // поддержка `id` и ``id``
	]

	let cleanedMessage = message

	for (const pattern of patterns) {
		cleanedMessage = cleanedMessage.replace(pattern, (_, id) => {
			if (id?.trim()) {
				dishIds.push(id.trim())
			}
			return ''
		})
	}

	return {
		cleanedMessage,
		dishIds,
	}
}


