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
