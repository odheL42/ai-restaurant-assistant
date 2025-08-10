import { useState } from 'react'
import clsx from 'clsx'

interface IntroductionChipProps {
	text: string
	initialSelected?: boolean
	onToggle?: (selected: boolean) => void
}

const IntroductionChip = ({
	text,
	initialSelected = false,
	onToggle,
}: IntroductionChipProps) => {
	const [selected, setSelected] = useState(initialSelected)

	const toggle = () => {
		const newSelected = !selected
		setSelected(newSelected)
		onToggle?.(newSelected)
	}

	return (
		<button
			onClick={toggle}
			className={clsx(
				'px-3 py-1 rounded-full text-sm text-[17px] font-sans',
				selected
					? 'bg-primary text-foreground-primary'
					: 'bg-muted',
				'hover:shadow-sm focus:outline-none',
			)}
		>
			{text}
		</button>
	)
}

export default IntroductionChip
