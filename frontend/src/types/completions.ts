import type { DBCart } from './cart'
import type { Preferences } from './preferences'

export interface CompletionsRequest {
	isCatering: boolean
	query: string
	cart: DBCart
	preferences: Preferences
}

export const ChunkType = {
  Default: 'default',
  Error: 'error',
} as const
export type ChunkType = (typeof ChunkType)[keyof typeof ChunkType]

export interface ChunkResponse {
	type: ChunkType
	text: string
}
