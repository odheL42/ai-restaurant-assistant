import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { components } from './components'

interface MarkdownRendererProps {
	content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
	return (
		<div className='markdown break-words w-full max-w-full overflow-hidden text-foreground font-sans text-base leading-relaxed'>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				skipHtml={false}
				components={components}
			>
				{content}
			</ReactMarkdown>
		</div>
	)
}

export default MarkdownRenderer
