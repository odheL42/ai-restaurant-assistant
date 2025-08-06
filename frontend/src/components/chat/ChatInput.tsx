import { ArrowUp } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useGeneration } from '../../context/GenerationContext'
import { PreferencesButton } from '../PreferencesButton'
import { Button } from '../ui/button'

type ChatInputProps = {
	onSubmit: (input: string) => void
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit }) => {
	const [message, setMessage] = useState('')
	const { isWaitingForGeneration, isGenerating } = useGeneration()
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const handleSubmit = (e: React.KeyboardEvent | React.MouseEvent) => {
		e.preventDefault()
		if (!message.trim() || isWaitingForGeneration || isGenerating) return
		setMessage('')
		onSubmit(message)
		if (textareaRef.current) {
			textareaRef.current.style.height = 'auto'
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value)

		const textarea = textareaRef.current
		if (textarea) {
			textarea.style.height = 'auto'
			textarea.style.height = `${Math.min(
				textarea.scrollHeight,
				6 * 24
			)}px`
		}
	}

	const handleKeydown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault()
			handleSubmit(event)
		}
	}

	return (
		<div className='flex flex-col h-full w-full items-center rounded-3xl bg-muted shadow-md'>
			<div className='flex w-full flex-1 rounded-xl border-none bg-transparent pt-5 pb-2'>
				<div className='flex min-h-full w-full flex-col'>
					<textarea
						ref={textareaRef}
						autoFocus
						value={message}
						rows={2}
						style={{ lineHeight: '24px' }}
						className='max-h-[6lh] w-full resize-none overflow-y-auto overflow-x-hidden border-0 bg-transparent px-6 outline-none focus:ring-0 focus-visible:ring-0 text-[18px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent dark:scrollbar-thumb-gray-600'
						onChange={handleChange}
						onKeyDown={handleKeydown}
						placeholder='Спросите что-нибудь...'
					></textarea>
				</div>
			</div>
			<div className='flex w-full justify-between pl-3 pr-6 mb-4 h-full'>
				<PreferencesButton />

				<Button
					disabled={
						isWaitingForGeneration ||
						isGenerating ||
						!message.trim()
					}
					onClick={handleSubmit}
					variant='default'
					size='icon'
					className='hover:cursor-pointer transition-transform duration-150 ease-in-out cursor-pointer hover:scale-110 hover:text-green-600'
				>
					<ArrowUp className='size-5' />
				</Button>
			</div>
		</div>
	)
}

export default ChatInput
