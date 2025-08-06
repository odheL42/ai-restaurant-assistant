import { useLayoutEffect, useRef } from 'react'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import 'react-toastify/dist/ReactToastify.css'
import ChatContent from '../components/chat/ChatContent'
import ChatInput from '../components/chat/ChatInput'
import Header from '../components/Header'
import { PreferencesModal } from '../components/PreferencesModal'
import { useGeneration } from '../context/GenerationContext'
import { useHistory } from '../context/HistoryContext'

const Chat = () => {
	const chatEndRef = useRef<HTMLDivElement | null>(null)
	const { messages, addUserMessage } = useHistory()
	const { isWaitingForGeneration, isGenerating, startGeneration } =
		useGeneration()

	useLayoutEffect(() => {
		scrollToBottom()
	}, [messages])

	const scrollToBottom = () => {
		if (chatEndRef.current) {
			requestAnimationFrame(() => {
				chatEndRef.current?.scrollIntoView({ behavior: 'auto' })
			})
		}
	}

	const handleSendMessage = async (input: string) => {
		if (!input.trim() || isGenerating || isWaitingForGeneration) return
		addUserMessage(input)
		await startGeneration(input)
	}

	return (
		<div className='h-dvh w-screen flex flex-col items-center bg-background'>
			<Header />
			<PreferencesModal />

			{/* Chat ScrollArea */}
			<ScrollArea className='w-full h-full overflow-y-auto'>
				<div className='flex flex-col items-center px-4 py-4'>
					<div className='w-full max-w-3xl max-sm:max-w-[95%]'>
						<ChatContent />
						<div ref={chatEndRef} />
					</div>
				</div>
				<ScrollBar orientation='vertical' />
			</ScrollArea>

			{/* Input */}
			<div
				className='flex mx-auto mb-8 w-full'
				style={{ maxWidth: 'min(95%, 48rem)' }}
			>
				<ChatInput onSubmit={handleSendMessage} />
			</div>
		</div>
	)
}

export default Chat
