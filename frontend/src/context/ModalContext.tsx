import { createContext, useContext, useState, type ReactNode } from 'react'

interface ModalContextType {
	isOpen: boolean
	open: () => void
	close: () => void
}

const ModalContext = createContext<ModalContextType | null>(null)

export const useModal = () => {
	const ctx = useContext(ModalContext)
	if (!ctx) throw new Error('ModalContext not found')
	return ctx
}

export const ModalProvider = ({ children }: { children: ReactNode }) => {
	const [isOpen, setIsOpen] = useState(false)

	const open = () => setIsOpen(true)
	const close = () => setIsOpen(false)

	return (
		<ModalContext.Provider value={{ isOpen, open, close }}>
			{children}
		</ModalContext.Provider>
	)
}
