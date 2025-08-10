// components/ChatIntroduction.tsx
import { Card, CardContent } from '@/components/ui/card'
import { useModal } from '@/context/ModalContext'
import { useMemo } from 'react'

const greetingsPool = [
	'Привет! Я — ИИ-официант. Помогу сделать заказ быстро и просто.',
	'Добро пожаловать в наше кафе! Здесь вы легко выберете и закажете любимые блюда.',
	'Здравствуйте! Это прототип для AI Talent Weekend — задавайте вопросы про меню и делайте заказ.',
	'Рад видеть вас в нашем кафе! Спрашивайте про блюда, рекомендации и заказы.',
]

const tipsPool = [
	{
		title: 'Аллергии и предпочтения',
		description:
			'Сообщите мне о своих ограничениях — подберу подходящие блюда',
	},
]

export const ChatIntroduction = () => {
	const { open } = useModal()

	const greeting = useMemo(() => {
		const index = Math.floor(Math.random() * greetingsPool.length)
		return greetingsPool[index]
	}, [])

	return (
		<div className='w-full mx-auto flex flex-col gap-4 px-4 pt-4'>
			<p className='text-base text-muted-foreground'>{greeting}</p>

			<div className='flex flex-col gap-2'>
				{tipsPool.map(({ title, description }, idx) => (
					<Card
						key={idx}
						onClick={open}
						className='p-4 hover:shadow-md transition-shadow cursor-pointer'
					>
						<CardContent className='p-0'>
							<h3 className='text-base font-medium'>{title}</h3>
							<p className='text-sm text-muted-foreground'>
								{description}
							</p>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}
