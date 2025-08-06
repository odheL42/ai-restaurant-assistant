import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ShoppingCart } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useCart } from '../context/CartContext'
import { useMenu } from '../context/MenuContext'
import CartModal from './CartModal'


const Cart: React.FC = () => {
	const { items } = useCart()
	const { dishById } = useMenu()
	const [isOpen, setIsOpen] = useState(false)
	const [highlight, setHighlight] = useState(false)

	useEffect(() => {
		if (Object.keys(items).length === 0) return
		setHighlight(true)
		const timeout = setTimeout(() => setHighlight(false), 300)
		return () => clearTimeout(timeout)
	}, [items])

	const totalAmount = useMemo(() => {
		return Object.entries(items).reduce((sum, [id, amount]) => {
			const dish = dishById?.[id]
			if (!dish) return sum
			return sum + dish.price * amount
		}, 0)
	}, [items, dishById])

	const formattedAmount = useMemo(() => {
		return totalAmount.toLocaleString('ru-RU', {
			style: 'currency',
			currency: 'RUB',
			maximumFractionDigits: 0,
		})
	}, [totalAmount])

	useEffect(() => {
		if (Object.keys(items).length === 0) return
		setHighlight(true)
		const timeout = setTimeout(() => setHighlight(false), 300)
		return () => clearTimeout(timeout)
	}, [items])

	return (
		<div>
			<Button
				variant='ghost'
				onClick={() => setIsOpen(true)}
				className={cn(
					'transition hover:text-primary text-muted-foreground hover:cursor-pointer ',
					highlight && 'animate-[ping_0.3s]'
				)}
				aria-label='Корзина'
			>
				{Object.keys(items).length > 0 && (
					<span className='text-sm select-none mr-1'>
						{formattedAmount}
					</span>
				)}
				<ShoppingCart className='size-5' />
			</Button>

			{isOpen && <CartModal onClose={() => setIsOpen(false)} />}
		</div>
	)
}

export default Cart
