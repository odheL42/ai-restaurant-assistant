import { apiGetNotes, apiSaveNotes } from '@/api/notes'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'

type NotesStore = {
	initialText: string
	editedText: string
	isEditing: boolean
	loading: boolean
	saving: boolean
	error: string | null

	loadNotesFromServer: () => Promise<void>
	saveNotesToServer: () => Promise<void>

	startEditing: () => void
	stopEditing: () => void
    
	updateEditedText: (value: string) => void
	reset: () => void
}

export const notesStore = createStore(
	persist<NotesStore>(
		(set, get) => ({
			initialText: '',
			editedText: '',
			isEditing: false,
			loading: false,
			saving: false,
			error: null,

			loadNotesFromServer: async () => {
				set({ loading: true, error: null })
				try {
					const text = await apiGetNotes()
					set({ initialText: text, editedText: text })
				} catch (err) {
					console.error('Ошибка при загрузке notes', err)
					set({ error: 'Ошибка при загрузке' })
				} finally {
					set({ loading: false })
				}
			},

			saveNotesToServer: async () => {
				const { editedText } = get()
				set({ saving: true, error: null })
				try {
					await apiSaveNotes({ notes: editedText })
					set({ initialText: editedText })
				} catch (err) {
					console.error('Ошибка при сохранении notes', err)
					set({ error: 'Ошибка при сохранении' })
				} finally {
					set({ saving: false })
				}
			},

			startEditing: () => set({ isEditing: true }),
			stopEditing: () => set({ isEditing: false }),
			updateEditedText: text => set({ editedText: text }),
			reset: () =>
				set(state => ({ editedText: state.initialText, error: null })),
		}),
		{ name: 'notes-storage' }
	)
)
