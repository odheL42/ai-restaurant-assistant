import { useGeneration } from '../../context/GenerationContext'
import { useHistory } from '../../context/HistoryContext'
import type { ClientChatMessage } from '../../types/chat'
import IconLoading from '../icons/IconLoading'
import AssistantMessage from './AssistantMessage'
import { ChatIntroduction } from './ChatIntroduction'
import UserMessage from './UserMessage'

const ChatContent = () => {
	const { messages, isHistoryLoading } = useHistory()
	const { isWaitingForGeneration } = useGeneration()

	const is_user_message = (m: ClientChatMessage) => {
		if (m.message.role == 'user') return true
		return false
	}

	return (
		<div className='flex flex-col w-full pb-32 pt-25 h-full'>
			<div className='mx-auto h-full w-full max-w-[95%] max-sm:max-w-[90%]'>
				{isHistoryLoading || messages.length > 0 ? (
					<>
						{messages.map(msg => {
							const isUser = is_user_message(msg)
							return (
								<div
									key={msg.index}
									className={isUser ? 'mb-3' : 'mb-6'}
								>
									{isUser ? (
										<UserMessage dbmessage={msg} />
									) : (
										<AssistantMessage dbmessage={msg} />
									)}
								</div>
							)
						})}
						{isWaitingForGeneration && (
							<IconLoading classNames='loading inline ml-2 first:ml-0' />
						)}
					</>
				) : (
					<ChatIntroduction />
				)}
			</div>
		</div>
	)
}

export default ChatContent
