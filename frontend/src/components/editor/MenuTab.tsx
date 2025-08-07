import MenuTable from '@/components/editor/MenuTable'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { menuStore } from '@/storage/menu'
import { Loader2, Save, Upload, X } from 'lucide-react'
import { useEffect } from 'react'
import { useStore } from 'zustand'

export default function MenuTab() {
	const isEditing = useStore(menuStore, s => s.isEditing)
	const startEditing = useStore(menuStore, s => s.startEditing)
	const stopEditing = useStore(menuStore, s => s.stopEditing)

	const loadMenu = useStore(menuStore, s => s.loadMenuFromServer)
	const recognizeMenu = useStore(menuStore, s => s.recognizeAndAppendMenu)

	const saveMenu = useStore(menuStore, s => s.saveMenuToServer)
	const editedDishes = useStore(menuStore, s => s.editedDishes)
	const reset = useStore(menuStore, s => s.reset)

	const loading = useStore(menuStore, s => s.loading)
	const loadingOcr = useStore(menuStore, s => s.loadingOcr)
	const saving = useStore(menuStore, s => s.saving)

	const error = useStore(menuStore, s => s.error)

	useEffect(() => {
		loadMenu()
	}, [])

	const handleLoad = async () => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'image/*'
		input.onchange = async () => {
			const file = input.files?.[0]
			if (file) {
				await recognizeMenu(file)
			}
		}
		input.click()
	}

	const handleReset = () => {
		reset()
		stopEditing()
	}

	const handleSave = async () => {
		try {
			await saveMenu()
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
		<div className='flex flex-col h-full w-full overflow-hidden'>
			{error && (
				<Alert variant='destructive' className='mb-4'>
					<AlertDescription>{error.message}</AlertDescription>
				</Alert>
			)}
			{/* Таблица со скроллом */}
			<div className='flex-1 min-h-0'>
				<MenuTable readOnly={!isEditing} />
			</div>

			{/* Управляющие кнопки */}
			<div className='w-full h-fit flex flex-row justify-end py-4 gap-4'>
				{isEditing ? (
					<>
						<Button
							variant='default'
							className='gap-2 hover:cursor-pointer'
							onClick={handleLoad}
							disabled={loading}
						>
							{loadingOcr ? (
								<Loader2 className='animate-spin' size={16} />
							) : (
								<Upload size={16} />
							)}
							Загрузить меню
						</Button>

						<Button
							variant='destructive'
							className='gap-2 hover:cursor-pointer'
							onClick={handleReset}
							disabled={loading || saving || loadingOcr}
						>
							<X size={16} />
							Отменить
						</Button>

						<Button
							className='gap-2 hover:cursor-pointer'
							onClick={handleSave}
							disabled={
								loadingOcr ||
								saving ||
								Object.keys(editedDishes).length === 0
							}
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
