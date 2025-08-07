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
import { Loader2, Plus, Trash2, Undo2 } from 'lucide-react'
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
	const removeEdited = useStore(menuStore, s => s.removeFromEdited)
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
		return 'dish_' + nanoid(4).toLowerCase()
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

	const handleReturn = (id: string) => {
		removeEdited(id)
	}

	const handleRemove = (id: string) => {
		removeDish(id)
	}

	if (!initial) {
		return (
			<div className='w-full text-center py-8'>
				<Loader2 className='mx-auto animate-spin' />
			</div>
		)
	}

	return (
		<div className='flex flex-col border rounded-md w-full h-full'>
			<Button
				disabled={readOnly}
				variant='outline'
				className='mt-2 ml-2 self-start hover:cursor-pointer'
				onClick={handleAdd}
			>
				<Plus size={16} />
				Добавить блюдо
			</Button>
			<ScrollArea className='h-full w-full pr-2 flex-1 min-h-0 pb-4'>
				<div className='min-w-[1200px] h-full'>
					<Table className='w-full h-full'>
						<TableHeader className='sticky top-0 bg-background w-full'>
							<TableRow>
								<TableHead className='w-fit'></TableHead>
								<TableHead className='w-1/3'>
									Название
								</TableHead>
								<TableHead className='w-1/10'>Цена</TableHead>
								<TableHead className='w-1/7'>
									Категория
								</TableHead>
								<TableHead className='w-1/10'>Выход</TableHead>
								<TableHead className='w-1/10'>
									Наличие
								</TableHead>
								<TableHead className='w-[2000px]'>
									Примечания
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody className='w-full'>
							{allIds.map(id => {
								const base = initial[id]
								const patch = edited[id]
								const dish = { ...base, ...patch }

								const isDeleted = patch === null

								const highlight = () => {
									if (isDeleted) {
										// Строка удалена
										return 'opacity-60 italic text-muted-foreground'
									}

									// Если patch есть, но ничего реально не изменилось — не подсвечиваем
									const patchKeys = patch
										? Object.keys(patch)
										: []
									const isRealDiff = patchKeys.some(
										key =>
											patch?.[
												key as keyof typeof patch
											] !==
											base?.[key as keyof typeof base]
									)
									if (isRealDiff) {
										return 'bg-muted/70'
									}

									// Без изменений
									return ''
								}

								return (
									<TableRow key={id} className={highlight()}>
										<TableCell className='text-right'>
											{isDeleted ? (
												<Button
													onClick={() =>
														handleReturn(id)
													}
													variant='ghost'
													size='icon'
													className='hover:cursor-pointer'
												>
													<Undo2 className='size-5 text-destructive hover:opacity-80' />
												</Button>
											) : (
												<Button
													onClick={() =>
														handleRemove(id)
													}
													variant='ghost'
													size='icon'
													disabled={
														readOnly || isDeleted
													}
													className='hover:cursor-pointer'
												>
													<Trash2 className='size-5 text-destructive hover:opacity-80' />
												</Button>
											)}
										</TableCell>
										<TableCell>
											<Input
												disabled={readOnly || isDeleted}
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
										<TableCell>
											<Input
												disabled={readOnly || isDeleted}
												value={dish.price}
												onChange={e =>
													handleChange(
														id,
														'price',
														parseInt(
															e.target.value ||
																'0',
															10
														)
													)
												}
											/>
										</TableCell>
										<TableCell>
											<Input
												disabled={readOnly || isDeleted}
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
										<TableCell>
											<Input
												disabled={readOnly || isDeleted}
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
										<TableCell>
											<input
												type='checkbox'
												disabled={readOnly || isDeleted}
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
										<TableCell>
											<Input
												disabled={readOnly || isDeleted}
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
				</div>

				<ScrollBar orientation='vertical' />
				<ScrollBar orientation='horizontal' className='h-4' />
			</ScrollArea>
		</div>
	)
}
