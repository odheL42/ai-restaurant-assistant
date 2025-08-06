import type { DBChatMessage } from '../types/chat'
import type { ChunkResponse, CompletionsRequest } from '../types/completions'
import { ChunkType } from '../types/completions'
import type { DBDish } from '../types/menu'
import type { RequestNotes } from '../types/notes'
import apiClient from '../utils/axios'

export const apiCompletions = async (
	request: CompletionsRequest,
	onData: (chunk: ChunkResponse) => void,
	onDone?: () => void,
	onError?: () => void
) => {
	const url = `/api/completions`

	console.log('REQUEST', request)

	try {
		const response = await fetch(url, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(request),
		})

		if (!response.ok || !response.body) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const reader = response.body.getReader()
		const decoder = new TextDecoder('utf-8')

		while (true) {
			const { value, done } = await reader.read()
			if (done) break

			const raw = decoder.decode(value, { stream: true })

			const lines = raw.split('\n\n')

			for (const line of lines) {
				if (!line.trim()) continue

				try {
					const parsed: ChunkResponse = JSON.parse(line)
					onData(parsed)
				} catch (err) {
					onData({ type: ChunkType.Default, text: line })
					throw err
				}
			}
		}

		onDone?.()
	} catch (e) {
		console.error(e)
		onError?.()
	}
}

export const apiGetHistory = async (): Promise<DBChatMessage[]> => {
	const response = await apiClient.get(`/api/history`)
	return response.data
}

export const apiGetMenu = async (isCatering: boolean): Promise<DBDish[]> => {
	const response = await apiClient.get(`/api/menu`, {
		params: {
			is_catering: isCatering,
		},
	})
	return response.data
}

export const apiClearHistory = async (): Promise<DBDish[]> => {
	const response = await apiClient.post(`/api/erase_history`)
	return response.data
}

export const apiGetNotes = async (isCatering: boolean): Promise<string> => {
	const response = await apiClient.get(`/api/get_notes`, {
		params: {
			is_catering: isCatering,
		},
	})
	return response.data
}

export const apiSaveNotes = async (
	request: RequestNotes
): Promise<DBDish[]> => {
	const response = await apiClient.post(`/api/save_notes`, request)
	return response.data
}

// GET: Получить конкретное блюдо по индексу
export const apiGetDishById = async (
	index: string,
	isCatering: boolean
): Promise<DBDish> => {
	const response = await apiClient.get(`/api/menu/byid`, {
		params: { index, is_catering: isCatering },
	})
	return response.data
}

// POST: Добавить новое блюдо
export const apiAddDish = async (dish: DBDish): Promise<void> => {
	await apiClient.post(`/api/menu`, dish)
}

// PUT: Обновить существующее блюдо по индексу
export const apiUpdateDish = async (
	index: string,
	dish: DBDish
): Promise<void> => {
	await apiClient.put(`/api/menu`, dish, {
		params: { index },
	})
}

// DELETE: Удалить блюдо по индексу
export const apiDeleteDish = async (index: string): Promise<void> => {
	await apiClient.delete(`/api/menu`, {
		params: { index },
	})
}
