import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { menuStore } from '@/storage/menu'
import clsx from 'clsx'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useStore } from 'zustand'
import { Button } from '../ui/button'

type Props = {
	readOnly?: boolean
}

export default function MenuTable({ readOnly = false }: Props) {
	const initial = useStore(menuStore, s => s.initialDishes)
	const edited = useStore(menuStore, s => s.editedDishes)
	const loading = useStore(menuStore, s => s.loading)
	const updateDish = useStore(menuStore, s => s.updateDishLocally)
	const removeDish = useStore(menuStore, s => s.removeDishLocally)
	const addDish = useStore(menuStore, s => s.addDishLocally)

	if (loading) {
		return (
			<div className='w-full text-center py-8'>
				<Loader2 className='mx-auto animate-spin' />
			</div>
		)
	}

	// Показываем даже удалённые (для отображения диффа)
	const allIds = Array.from(
		new Set([...Object.keys(initial), ...Object.keys(edited)])
	)

	const handleChange = (
		id: string,
		field: keyof (typeof initial)[string],
		value: string | number | boolean
	) => {
		updateDish(id, { [field]: value })
	}

	function generateDishId() {
		return 'dish_' + nanoid(4)
	}

	const handleAdd = () => {
		const id = generateDishId()
		addDish({
			index: id,
			title: '',
			price: 0,
			category: '',
			quantity: '',
			stock: false,
			notes: '',
		})
	}

	const handleRemove = (id: string) => {
		removeDish(id)
	}

	return (
		<div>
			<Button
				disabled={readOnly}
				variant='outline'
				className='mt-2 ml-2 self-start hover:cursor-pointer'
				onClick={handleAdd}
			>
				<Plus size={16} />
				Добавить блюдо
			</Button>
			<ScrollArea className='overflow-x-auto'>
				<Table className='w-fit h-fit'>
					<TableHeader className='sticky top-0 z-10 bg-background w-fit'>
						<TableRow>
							<TableHead className='w-fit'></TableHead>
							<TableHead>Название</TableHead>
							<TableHead className='w-[100px]'>Цена</TableHead>
							<TableHead className='w-[150px]'>
								Категория
							</TableHead>
							<TableHead className='w-[100px]'>Выход</TableHead>
							<TableHead className='w-[80px]'>Наличие</TableHead>
							<TableHead className='w-[200px]'>
								Примечания
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='w-fit'>
						{allIds.map(id => {
							const base = initial[id]
							const patch = edited[id]
							const dish = { ...base, ...patch }

							const rowClass = clsx({
								'bg-red-50': !initial[id], // удалён
							})

							const highlight = (field: keyof typeof dish) => {
								if (!base) return ''
                                if (base === undefined) return ''
                                if (base === null) return ''
								if (base[field] === dish[field]) return ''
								return 'bg-green-500'
							}

							return (
								<TableRow key={id} className={rowClass}>
									<TableCell className='text-right'>
										<Button
											onClick={() => handleRemove(id)}
											variant='ghost'
											size='icon'
											disabled={readOnly}
											className='hover:cursor-pointer'
										>
											<Trash2 className='size-5 text-destructive hover:opacity-80' />
										</Button>
									</TableCell>
									<TableCell className={highlight('title')}>
										<Input
											disabled={readOnly}
											value={dish.title}
											onChange={e =>
												handleChange(
													id,
													'title',
													e.target.value
												)
											}
										/>
									</TableCell>
									<TableCell className={highlight('price')}>
										<Input
											disabled={readOnly}
											value={dish.price}
											onChange={e =>
												handleChange(
													id,
													'price',
													parseInt(
														e.target.value || '0',
														10
													)
												)
											}
										/>
									</TableCell>
									<TableCell
										className={highlight('category')}
									>
										<Input
											disabled={readOnly}
											value={dish.category || ''}
											onChange={e =>
												handleChange(
													id,
													'category',
													e.target.value
												)
											}
										/>
									</TableCell>
									<TableCell
										className={highlight('quantity')}
									>
										<Input
											disabled={readOnly}
											value={dish.quantity || ''}
											onChange={e =>
												handleChange(
													id,
													'quantity',
													e.target.value
												)
											}
										/>
									</TableCell>
									<TableCell className={highlight('stock')}>
										<input
											type='checkbox'
											disabled={readOnly}
											checked={dish.stock || false}
											className='hover:cursor-pointer'
											onChange={e =>
												handleChange(
													id,
													'stock',
													e.target.checked
												)
											}
										/>
									</TableCell>
									<TableCell className={highlight('notes')}>
										<Input
											disabled={readOnly}
											value={dish.notes || ''}
											onChange={e =>
												handleChange(
													id,
													'notes',
													e.target.value
												)
											}
										/>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
				<ScrollBar orientation='horizontal' />
			</ScrollArea>
		</div>
	)
}
