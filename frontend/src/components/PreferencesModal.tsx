import { useMenuMode } from '@/context/MenuModeContext'
import { useModal } from '@/context/ModalContext'
import { usePreferences } from '@/context/PreferencesContext'
import { useEffect, useState } from 'react'
import { apiGetNotes, apiSaveNotes } from '../api/api'
import type { RequestNotes } from '../types/notes'
import type { Preferences } from '../types/preferences'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import IntroductionChip from './chat/IntroductionChip'

export const PreferencesModal = () => {
	const { isOpen, close } = useModal()
	const { preferences, togglePreference } = usePreferences()
	const { isCatering } = useMenuMode()
	const [notes, setNotes] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false)
	const [, setSaving] = useState<boolean>(false)

	useEffect(() => {
		if (!isOpen) return
		setLoading(true)
		apiGetNotes(isCatering)
			.then(data => setNotes(data))
			.finally(() => setLoading(false))
	}, [isOpen])

	const handleNotesChange = async (
		e: React.ChangeEvent<HTMLTextAreaElement>
	) => {
		const value = e.target.value
		setNotes(value)
		setSaving(true)
		const request: RequestNotes = { notes: value, isCatering }

		try {
			await apiSaveNotes(request)
		} finally {
			setSaving(false)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={close}>
			<DialogContent className='max-w-lg max-h-[80vh] overflow-y-auto'>
				<DialogHeader>
					<DialogTitle>Предпочтения</DialogTitle>
				</DialogHeader>

				<div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
					{(Object.keys(preferences) as (keyof Preferences)[]).map(
						key => (
							<IntroductionChip
								key={key}
								text={key}
								initialSelected={preferences[key]}
								onToggle={() => togglePreference(key)}
							/>
						)
					)}
				</div>

				<div className='mt-4 space-y-2'>
					<Label htmlFor='notes'>Заметки</Label>
					<Textarea
						id='notes'
						value={notes}
						onChange={handleNotesChange}
						placeholder='Например, "Я люблю острые блюда и не ем мясо..."'
						className='min-h-[160px]'
					/>
					{loading && (
						<p className='text-sm text-muted-foreground'>
							Загрузка заметок...
						</p>
					)}
				</div>
			</DialogContent>
		</Dialog>
	)
}
