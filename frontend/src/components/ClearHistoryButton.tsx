import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { apiClearHistory } from '../api/api'
import { useHistory } from '../context/HistoryContext'
import ClearHistoryModal from './ClearHistoryModal'

const ClearHistoryButton: React.FC = () => {
	const { clearHistory } = useHistory()
	const [isModalOpen, setModalOpen] = useState(false)
	const [isLoading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const openModal = () => {
		setError(null)
		setModalOpen(true)
	}

	const closeModal = () => {
		if (!isLoading) {
			setModalOpen(false)
		}
	}

	const handleConfirm = async () => {
		setLoading(true)
		setError(null)
		try {
			await apiClearHistory()
			clearHistory()
			setModalOpen(false)
		} catch (e) {
			setError('Ошибка при очистке истории. Попробуйте ещё раз.')
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<Button
				variant='ghost'
				size='icon'
				className='text-muted-foreground hover:text-destructive transition hover:cursor-pointer'
				onClick={openModal}
				aria-label='Удалить чат'
			>
				<Trash2 className='size-5' />
			</Button>

			<ClearHistoryModal
				isOpen={isModalOpen}
				onClose={closeModal}
				onConfirm={handleConfirm}
				loading={isLoading}
				error={error}
			/>
		</>
	)
}

export default ClearHistoryButton
