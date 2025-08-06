import { SlidersVertical } from 'lucide-react'
import { useModal } from '../context/ModalContext'
import { Button } from './ui/button'

export const PreferencesButton = () => {
	const { open } = useModal()

	return (
		<Button
			onClick={open}
			title='Открыть настройки предпочтений'
			variant='ghost'
            className='hover:cursor-pointer'
		>
			<SlidersVertical className='size-5' />Предпочтения
		</Button>
	)
}
