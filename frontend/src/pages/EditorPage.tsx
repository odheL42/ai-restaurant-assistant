import MenuTab from '@/components/editor/MenuTab'
import PromptsTab from '@/components/editor/PromptsTab'
import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from 'zustand'
import { menuStore } from '@/storage/menu'

export default function EditorPage() {
    const initialDishes = useStore(menuStore, s => s.initialDishes)
	const [tab, setTab] = useState<'menu' | 'info'>('menu')
	const navigate = useNavigate()

	if (!initialDishes) {
		return (
			<div className='w-full text-center py-8'>
				<Loader2 className='mx-auto animate-spin' />
			</div>
		)
	}

	return (
		<div className='flex flex-col h-dvh p-6 w-full max-w-5xl mx-auto'>
			<div className='flex flex-row w-full h-fit py-4 gap-4'>
				<Button
					className='w-fit hover:cursor-pointer'
					onClick={() => navigate('/')}
				>
					Назад к чату
				</Button>
				<Select
					value={tab}
					onValueChange={val => setTab(val as 'menu' | 'info')}
				>
					<SelectTrigger className='w-[220px] hover:cursor-pointer'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem
							className='hover:cursor-pointer'
							value='menu'
						>
							Меню
						</SelectItem>
						<SelectItem
							className='hover:cursor-pointer'
							value='info'
						>
							Информация о кафе
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{tab === 'menu' ? (
				<>
					<h1 className='text-2xl font-bold mb-4'>
						Редактирование меню
					</h1>
					<MenuTab />
				</>
			) : (
				<>
					<h1 className='text-2xl font-bold mb-4'>
						Информация о кафе
					</h1>
					<PromptsTab />
				</>
			)}
		</div>
	)
}
