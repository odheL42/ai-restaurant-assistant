import type { CartItemsMap } from '../types/cart'

const STORAGE_KEY = 'cartItems'

export const saveCart = (items: CartItemsMap) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
	} catch (e) {
		console.error(e)
	}
}

export const loadCart = (): CartItemsMap | null => {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : null
	} catch (e) {
		console.error(e)
		return null
	}
}
