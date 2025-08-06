export type Role = 'system' | 'user' | 'assistant' | 'function'

export interface ChatMessage {
	role: Role
	content: string
	name?: string | null
}

export interface DBChatMeta {
	time: string // ISO string, e.g. "2025-07-14T12:34:56.789+07:00"
}

export interface DBChatMessage {
	index: string
	message: ChatMessage
	meta: DBChatMeta
}

export interface ClientChatMessage {
	index: string
	message: ChatMessage
}
