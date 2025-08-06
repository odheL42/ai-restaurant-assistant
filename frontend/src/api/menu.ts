import type { DBDish } from '../types/menu'
import apiClient from '../utils/axios'

export const apiGetMenu = async (): Promise<DBDish[]> => {
	const response = await apiClient.get(`/api/menu`)
	return response.data
}

// POST: Добавить новое блюдо
export const apiAddDish = async (
	dish: Omit<DBDish, 'index'>
): Promise<string> => {
	const res = await apiClient.post(`/api/menu`, dish)
	return res.data // <- возвращает index
}

// PUT: Обновить существующее блюдо
export const apiUpdateDish = async (dish: DBDish): Promise<void> => {
	await apiClient.put(`/api/menu`, dish)
}

// PUT: Обновить всё меню разом
export const apiSaveFullMenu = async (dishes: DBDish[]): Promise<void> => {
	await apiClient.put(`/api/menu/all`, dishes)
}

// DELETE: Удалить блюдо по индексу
export const apiDeleteDish = async (index: string): Promise<void> => {
	await apiClient.delete(`/api/menu`, {
		params: { index },
	})
}

export const apiRecognizeMenu = async (file: File): Promise<DBDish[]> => {
	const formData = new FormData()
	formData.append('file', file)

	const res = await apiClient.post(`/api/ocr`, formData, {
		headers: { 'Content-Type': 'multipart/form-data' },
	})

	return res.data
}
