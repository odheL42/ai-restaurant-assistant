import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { notesStore } from '@/storage/notes'
import { Loader2, Save, X } from 'lucide-react'
import { useEffect } from 'react'
import { useStore } from 'zustand'

export default function PromptsTab() {
	const isEditing = useStore(notesStore, s => s.isEditing)
	const startEditing = useStore(notesStore, s => s.startEditing)
	const stopEditing = useStore(notesStore, s => s.stopEditing)
	const editedText = useStore(notesStore, s => s.editedText)
	const initialText = useStore(notesStore, s => s.initialText)

	const updateText = useStore(notesStore, s => s.updateEditedText)
	const saveNotes = useStore(notesStore, s => s.saveNotesToServer)
	const loadNotes = useStore(notesStore, s => s.loadNotesFromServer)

	const reset = useStore(notesStore, s => s.reset)

	const loading = useStore(notesStore, s => s.loading)
	const saving = useStore(notesStore, s => s.saving)

	const error = useStore(notesStore, s => s.error)

	useEffect(() => {
		loadNotes()
	}, [])

	const handleReset = () => {
		reset()
		stopEditing()
	}

	const handleSave = async () => {
		try {
			await saveNotes()
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
