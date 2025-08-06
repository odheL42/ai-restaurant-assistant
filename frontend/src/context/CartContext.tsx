import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { loadCart, saveCart } from '../storage/cart'
import type { CartItemsMap } from '../types/cart'

interface CartContextValue {
	items: CartItemsMap
	addItem: (id: string, amount?: number) => void
	removeItem: (id: string) => void
	clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<CartItemsMap>({})

	useEffect(() => {
		const stored = loadCart()
		if (stored) {
			setItems(stored)
		}
	}, [])

	const saveAndSetItems = (newItems: CartItemsMap) => {
		setItems(newItems)
		saveCart(newItems)
	}

	const addItem = (id: string, amount: number = 1) => {
		const newItems = {
			...items,
			[id]: (items[id] || 0) + amount,
		}
		saveAndSetItems(newItems)
	}

	const removeItem = (id: string, amount: number = 1) => {
		const currentAmount = items[id] ?? 0
		let newItems: CartItemsMap
		if (amount === -1 || currentAmount <= amount) {
			newItems = { ...items }
			delete newItems[id]
		} else {
			newItems = {
				...items,
				[id]: currentAmount - amount,
			}
		}
		saveAndSetItems(newItems)
	}

	const clearCart = () => {
		saveAndSetItems({})
	}

	return (
		<CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
			{children}
		</CartContext.Provider>
	)
}

export const useCart = () => {
	const ctx = useContext(CartContext)
	if (!ctx) throw new Error('useCart must be used within <CartProvider>')
	return ctx
}
