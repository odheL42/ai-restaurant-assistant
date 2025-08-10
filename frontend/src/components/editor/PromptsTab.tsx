import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cafeInfoStore } from '@/storage/cafeInfo'

import { Loader2, Save, X } from 'lucide-react'
import { useEffect } from 'react'
import { useStore } from 'zustand'

export default function PromptsTab() {
	const isEditing = useStore(cafeInfoStore, s => s.isEditing)
	const startEditing = useStore(cafeInfoStore, s => s.startEditing)
	const stopEditing = useStore(cafeInfoStore, s => s.stopEditing)
	const editedText = useStore(cafeInfoStore, s => s.editedText)
	const initialText = useStore(cafeInfoStore, s => s.initialText)

	const updateText = useStore(cafeInfoStore, s => s.updateEditedText)
	const saveInfo = useStore(cafeInfoStore, s => s.saveInfoToServer)
	const loadInfo = useStore(cafeInfoStore, s => s.loadInfoFromServer)

	const reset = useStore(cafeInfoStore, s => s.reset)

	const loading = useStore(cafeInfoStore, s => s.loading)
	const saving = useStore(cafeInfoStore, s => s.saving)

	const error = useStore(cafeInfoStore, s => s.error)

	useEffect(() => {
		loadInfo()
	}, [])

	const handleReset = () => {
		reset()
		stopEditing()
	}

	const handleSave = async () => {
		try {
			await saveInfo()
			stopEditing()
		} catch (err) {
			console.warn(err)
		}
	}

	if (loading) {
		return (
			<div className='w-full text-center py-8'>
				<Loader2 className='mx-auto animate-spin' />
			</div>
		)
	}

	return (
		<div className='w-full h-full'>
			{error && (
				<Alert variant='destructive'>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<Textarea
				value={editedText}
				maxLength={800}
				disabled={!isEditing}
				onChange={e => updateText(e.target.value)}
				placeholder='Введите описание кафе, особенности, расписание и т.п.'
				className='h-[70%] resize-none'
			/>
			{/* Управляющие кнопки */}
			<div className='w-full h-fit flex flex-row justify-end py-4 gap-4'>
				{isEditing ? (
					<>
						<Button
							variant='destructive'
							className='gap-2 hover:cursor-pointer'
							onClick={handleReset}
							disabled={loading || saving}
						>
							<X size={16} />
							Отменить
						</Button>

						<Button
							className='gap-2 hover:cursor-pointer'
							onClick={handleSave}
							disabled={saving || initialText === editedText}
						>
							{saving && (
								<Loader2 className='animate-spin' size={16} />
							)}
							{!saving && <Save size={16} />}
							Сохранить
						</Button>
					</>
				) : (
					<Button
						className='hover:cursor-pointer'
						onClick={() => startEditing()}
					>
						Редактировать
					</Button>
				)}
			</div>
		</div>
	)
}
