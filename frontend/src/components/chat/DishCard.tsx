import { Plus } from 'lucide-react'
import type { FC } from 'react'
import { useCart } from '../../context/CartContext'
import type { DBDish } from '../../types/menu'
import { Button } from '../ui/button'

type Props = {
	dish: DBDish
}

const capitalizeFirstLetter = (str: string): string =>
	str ? str[0].toUpperCase() + str.slice(1) : str

const DishCard: FC<Props> = ({ dish }) => {
	const { addItem, items } = useCart()
	const handleAdd = () => addItem(dish.index)

	const itemCount = items[dish.index] || 0

	return (
		<div className='w-full py-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center'>
			<div className='flex flex-col flex-1 pl-2'>
				<h3 className='text-sm font-medium text-gray-900 dark:text-white leading-snug'>
					{capitalizeFirstLetter(dish.title)}
				</h3>
				{dish.composition && (
					<p className='ml-1 text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-tight'>
						{dish.composition}
					</p>
				)}
				<span className='ml-1 mt-1 text-xs text-gray-800 dark:text-gray-300'>
					{dish.price}
					{dish.quantity && ` • ${dish.quantity}`}
				</span>
			</div>

			<div className='flex items-center'>
				{itemCount > 0 && (
					<span className='text-gray-800 dark:text-gray-200 text-sm mr-2'>
						{itemCount}
					</span>
				)}

				<Button
					variant='ghost'
                    size='icon'
					onClick={handleAdd}
					className='text-gray-600 hover:text-green-600 active:scale-90 active:text-green-700 dark:text-gray-300 dark:hover:text-green-500 transition-transform duration-150 ease-in-out cursor-pointer hover:scale-110'
					aria-label='Добавить'
				>
					<Plus className='size-6' />
				</Button>
			</div>
		</div>
	)
}

export default DishCard
