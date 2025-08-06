import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { useCart } from '@/context/CartContext'
import { useMenu } from '@/context/MenuContext'
import React from 'react'

interface Props {
	onClose: () => void
}

const CartModal: React.FC<Props> = ({ onClose }) => {
	const { items, removeItem, clearCart } = useCart()
	const { dishById } = useMenu()
	const cartEntries = Object.entries(items)

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className='max-w-lg max-h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Корзина</DialogTitle>
				</DialogHeader>

				{cartEntries.length === 0 ? (
					<p className='text-muted-foreground'>Пусто</p>
				) : (
					<ul className='flex flex-col gap-2'>
						{cartEntries.map(([id, amount]) => {
							const dish = dishById?.[id]
							if (!dish) return null
							return (
								<li
									key={id}
									className='flex justify-between items-center text-sm'
								>
									<span className='text-foreground'>
										{dish.title} — {amount} × {dish.price}₽
									</span>
									<Button
										variant='link'
										size='sm'
										className='text-destructive px-1 h-6'
										onClick={() => removeItem(id)}
									>
										Удалить
									</Button>
								</li>
							)
						})}
					</ul>
				)}

				{cartEntries.length > 0 && (
					<Button
						variant='link'
						size='sm'
						className='mt-4 text-foreground underline-offset-4'
						onClick={clearCart}
					>
						Очистить корзину
					</Button>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default CartModal
