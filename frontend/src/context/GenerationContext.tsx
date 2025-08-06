import { createContext, type ReactNode, useContext, useState } from 'react'
import { apiCompletions } from '../api/api'
import type { ChunkResponse } from '../types/completions'
import { useCart } from './CartContext'
import { useMenuMode } from './MenuModeContext'
import { usePreferences } from './PreferencesContext'

interface GenerationContextValue {
	isGenerating: boolean
	isWaitingForGeneration: boolean
	startGeneration: (query: string) => Promise<void>
}

const GenerationContext = createContext<GenerationContextValue | null>(null)

export const GenerationProvider = ({
	children,
	onData,
	onDone,
	onError,
}: {
	children: ReactNode
	onData: (data: string) => void
	onDone?: () => void
	onError?: (error: string) => void
}) => {
	const [isGenerating, setIsGenerating] = useState(false)
	const [isWaitingForGeneration, setIsWaiting] = useState(false)

	const { items } = useCart()
	const { preferences } = usePreferences()
	const { isCatering } = useMenuMode()

	const startGeneration = async (query: string) => {
		if (isGenerating || isWaitingForGeneration) return

		setIsWaiting(true)

		const request = {
			isCatering: isCatering,
			query: query,
			cart: { items: items },
			preferences: preferences,
		}

		await apiCompletions(
			request,
			(chunk: ChunkResponse) => {
				if (isWaitingForGeneration) setIsWaiting(false)
				if (!isGenerating) setIsGenerating(true)

				if (chunk.type === 'error') {
					console.error('Error chunk received:', chunk)
					setIsGenerating(false)
					setIsWaiting(false)
					onError?.(chunk.text)
					return // Stop generation
				}
				onData(chunk.text)
			},
			() => {
				setIsGenerating(false)
				setIsWaiting(false)
				onDone?.()
			},
			() => {
				setIsGenerating(false)
				setIsWaiting(false)
			},
		)
	}

	return (
		<GenerationContext.Provider
			value={{ isGenerating, isWaitingForGeneration, startGeneration }}
		>
			{children}
		</GenerationContext.Provider>
	)
}

export const useGeneration = () => {
	const ctx = useContext(GenerationContext)
	if (!ctx) {
		throw new Error(
			'useGeneration must be used within <GenerationProvider>',
		)
	}
	return ctx
}
