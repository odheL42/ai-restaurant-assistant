import type { DBChatMessage } from '../types/chat'
import type { ChunkResponse, CompletionsRequest } from '../types/completions'
import { ChunkType } from '../types/completions'
import type { DBDish } from '../types/menu'
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

export const apiClearHistory = async (): Promise<DBDish[]> => {
	const response = await apiClient.post(`/api/erase_history`)
	return response.data
}
