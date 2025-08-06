import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

export default function PromptsTab() {
	const [text, setText] = useState('')
	const [, setEdited] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(e.target.value)
		setEdited(true)
	}

	return (
		<div className='w-full h-full'>
			<Textarea
				value={text}
				maxLength={800}
				onChange={handleChange}
				placeholder='Введите описание кафе, особенности, расписание и т.п.'
				className='h-[70%] resize-none'
			/>
		</div>
	)
}
