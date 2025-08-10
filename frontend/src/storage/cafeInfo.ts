import { apiGetCafeInfo, apiSaveCafeInfo } from '@/api/cafeInfo'
import { createStore } from 'zustand'
import { persist } from 'zustand/middleware'

type CafeInfoStore = {
    initialText: string
    editedText: string
    isEditing: boolean
    loading: boolean
    saving: boolean
    error: string | null

    loadInfoFromServer: () => Promise<void>
    saveInfoToServer: () => Promise<void>

    startEditing: () => void
    stopEditing: () => void
    
    updateEditedText: (value: string) => void
    reset: () => void
}

export const cafeInfoStore = createStore(
    persist<CafeInfoStore>(
        (set, get) => ({
            initialText: '',
            editedText: '',
            isEditing: false,
            loading: false,
            saving: false,
            error: null,

            loadInfoFromServer: async () => {
                set({ loading: true, error: null })
                try {
                    const text = await apiGetCafeInfo()
                    set({ initialText: text, editedText: text })
                } catch (err) {
                    console.error('Ошибка при загрузке cafe info', err)
                    set({ error: 'Ошибка при загрузке' })
                } finally {
                    set({ loading: false })
                }
            },

            saveInfoToServer: async () => {
                const { editedText } = get()
                set({ saving: true, error: null })
                try {
                    await apiSaveCafeInfo(editedText)
                    set({ initialText: editedText })
                } catch (err) {
                    console.error('Ошибка при сохранении cafe info', err)
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
        { name: 'cafe-info-storage' }
    )
)
