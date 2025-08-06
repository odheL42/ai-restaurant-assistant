import {
	createContext,
	 type ReactNode,
	useContext,
	useEffect,
	useState,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { apiGetHistory } from '../api/api'
import type { ClientChatMessage, DBChatMessage, Role } from '../types/chat'

interface HistoryContextValue {
	messages: ClientChatMessage[]
	addUserMessage: (content: string) => void
	updateAssistantMessage: (content: string) => void
	clearHistory: () => void
	isHistoryLoading: boolean
}

const HistoryContext = createContext<HistoryContextValue | null>(null)

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
	const [messages, setMessages] = useState<ClientChatMessage[]>([])
	const [isHistoryLoading, setIsHistoryLoading] = useState(true)

	useEffect(() => {
		const loadMessages = async () => {
			try {
				const history = await apiGetHistory()
				const clientMessages = history.map((msg: DBChatMessage) => ({
					index: msg.index ?? uuidv4(),
					message: msg.message,
				}))
				setMessages(clientMessages)
			} catch (error) {
				console.error('Error loading chat messages', error)
			} finally {
				setIsHistoryLoading(false)
			}
		}

		loadMessages()
	}, [])

	const addUserMessage = (content: string) => {
		setMessages(prev => [
			...prev,
			{
				index: uuidv4(),
				message: { role: 'user' as Role, content },
			},
		])
	}

	const makeAssistantMessage = (content = '') => {
		return {
			index: uuidv4(),
			message: { role: 'assistant' as Role, content },
		}
	}

	const updateAssistantMessage = (content: string) => {
		setMessages(prev => {
			const last = prev[prev.length - 1]
			if (!last || last.message.role !== 'assistant')
				return [...prev, makeAssistantMessage(content)]
			const updated = {
				...last,
				message: {
					...last.message,
					content: last.message.content + content,
				},
			}
			return [...prev.slice(0, -1), updated]
		})
	}

	const clearHistory = () => {
		setMessages([])
	}

	return (
		<HistoryContext.Provider
			value={{
				messages,
				addUserMessage,
				updateAssistantMessage,
				clearHistory,
				isHistoryLoading,
			}}
		>
			{children}
		</HistoryContext.Provider>
	)
}

export const useHistory = () => {
	const ctx = useContext(HistoryContext)
	if (!ctx)
		throw new Error('useHistory must be used within <HistoryProvider>')
	return ctx
}
