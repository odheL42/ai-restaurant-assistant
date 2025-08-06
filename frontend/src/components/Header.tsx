import { useState } from 'react'
import Cart from './Cart'
import CartModal from './CartModal'
import ClearHistoryButton from './ClearHistoryButton'

export default function Header() {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<header className='relative w-full max-w-3xl rounded-b-2xl bg-muted px-4 shadow-sm py-3 flex items-center justify-between'>
			{/* Левая кнопка */}
			<ClearHistoryButton />

			{/* Центрированный заголовок (позиционируется абсолютно поверх) */}
			<div className='absolute inset-0 flex justify-center items-center pointer-events-none'>
				<div className='flex flex-col items-center'>
					<h2 className='text-xl font-extrabold text-foreground select-none'>
						Экокафе «Теплица»
					</h2>
					<p className='mt-0.5 text-xs font-normal tracking-wide text-green-500 select-none'>
						AI Talent Weekend by «513»
					</p>
				</div>
			</div>

			{/* Правая часть: сумма + корзина */}
			<div className='flex items-center gap-2'>
				<Cart />
			</div>

			{isOpen && <CartModal onClose={() => setIsOpen(false)} />}
		</header>
	)
}
