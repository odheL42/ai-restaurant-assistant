import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { apiDeleteDish, apiUpdateDish } from '@/api/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMenu } from '@/context/MenuContext'
import type { DBDish } from '@/types/menu'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

export default function MenuEditorPage() {
	const { dishById, loading, refetch } = useMenu()
	const [editing, setEditing] = useState<Record<string, Partial<DBDish>>>({})
	const [saving, setSaving] = useState(false)

	if (loading || !dishById) {
		return (
			<div className='w-full text-center py-8'>
				<Loader2 className='mx-auto animate-spin' />
			</div>
		)
	}

	const handleChange = (
		id: string,
		field: keyof DBDish,
		value: string | number
	) => {
		setEditing(prev => ({
			...prev,
			[id]: { ...prev[id], [field]: value },
		}))
	}

	const handleSave = async (id: string) => {
		const updates = editing[id]
		if (!updates) return
		setSaving(true)
		try {
			await apiUpdateDish(id, { ...dishById[id], ...updates })
			await refetch()
			setEditing(prev => {
				const copy = { ...prev }
				delete copy[id]
				return copy
			})
		} finally {
			setSaving(false)
		}
	}

	const handleDelete = async (id: string) => {
		setSaving(true)
		try {
			await apiDeleteDish(id)
			await refetch()
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className='p-6 w-full max-w-5xl mx-auto'>
			<h1 className='text-2xl font-bold mb-4'>Редактирование меню</h1>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='w-[80px]'>ID</TableHead>
							<TableHead>Название</TableHead>
							<TableHead className='w-[100px]'>Цена</TableHead>
							<TableHead className='w-[200px]'>
								Примечания
							</TableHead>
							<TableHead className='w-[180px]'>
								Действия
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Object.entries(dishById).map(([id, dish]) => {
							const changes = editing[id] || {}
							return (
								<TableRow key={id}>
									<TableCell>{id}</TableCell>
									<TableCell>
										<Input
											value={changes.title ?? dish.title}
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
											type='number'
											value={changes.price ?? dish.price}
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
									<TableCell>
										<Input
											value={
												changes.notes ??
												dish.notes ??
												''
											}
											onChange={e =>
												handleChange(
													id,
													'notes',
													e.target.value
												)
											}
										/>
									</TableCell>
									<TableCell className='flex gap-2'>
										<Button
											variant='default'
											size='sm'
											disabled={saving}
											onClick={() => handleSave(id)}
										>
											Сохранить
										</Button>
										<Button
											variant='destructive'
											size='icon'
											disabled={saving}
											onClick={() => handleDelete(id)}
										>
											<Trash2 className='w-4 h-4' />
										</Button>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
