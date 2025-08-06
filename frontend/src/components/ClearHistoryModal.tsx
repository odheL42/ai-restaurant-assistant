import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type ClearHistoryModalProps = {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => Promise<void>
	loading: boolean
	error: string | null
}

const ClearHistoryModal: React.FC<ClearHistoryModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
	error,
}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className='max-w-sm'>
				<DialogHeader>
					<DialogTitle>Подтверждение</DialogTitle>
				</DialogHeader>

				<p className='text-sm text-muted-foreground'>
					Вы действительно хотите очистить историю чата?
				</p>

				{error && <p className='text-sm text-destructive'>{error}</p>}

				<DialogFooter className='mt-4'>
					<Button
						variant='secondary'
						onClick={onClose}
						disabled={loading}
						className='hover:cursor-pointer'
					>
						Отмена
					</Button>
					<Button
						variant='destructive'
						onClick={onConfirm}
						disabled={loading}
						className='hover:cursor-pointer'
					>
						Очистить
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default ClearHistoryModal
