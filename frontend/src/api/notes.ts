import type { DBDish } from '../types/menu'
import type { RequestNotes } from '../types/notes'
import apiClient from '../utils/axios'

export const apiGetNotes = async (): Promise<string> => {
	const response = await apiClient.get(`/api/get_notes`)
	return response.data
}

export const apiSaveNotes = async (
	request: RequestNotes
): Promise<DBDish[]> => {
	const response = await apiClient.post(`/api/save_notes`, request)
	return response.data
}
