import React, { type JSX } from 'react'
import type { Components } from 'react-markdown'

const createHeadingComponent = (level: number): Components['h1'] => {
	const HeadingComponent: Components['h1'] = ({ children, ...props }) => {
		const Tag = `h${level}` as keyof JSX.IntrinsicElements
		const className = `text-${6 - level}xl font-bold mb-4`
		return React.createElement(Tag, { className, ...props }, children)
	}
	return Object.assign(HeadingComponent, { displayName: `Heading${level}` })
}
function isReactElementWithProps(
	node: unknown
): node is React.ReactElement<{ children?: React.ReactNode }> {
	return React.isValidElement(node)
}
const extractTextContent = (node: React.ReactNode): string => {
	if (typeof node === 'string') return node
	if (typeof node === 'number') return String(node)
	if (Array.isArray(node)) return node.map(extractTextContent).join('')
	if (isReactElementWithProps(node)) {
		return extractTextContent(node.props.children)
	}
	return ''
}

const ParagraphComponent: Components['p'] = ({ children, ...props }) => {
	return (
		<div className='mb-4 break-words w-full max-w-full  ' {...props}>
			{children}
		</div>
	)
}

const UnorderedListComponent: Components['ul'] = ({ children, ...props }) => {
	return (
		<ul
			className='list-disc pl-5 mb-4 break-words w-full max-w-full '
			{...props}
		>
			{children}
		</ul>
	)
}

const OrderedListComponent: Components['ol'] = ({ children, ...props }) => {
	return (
		<ol
			className='list-decimal pl-5 mb-4 break-words w-full max-w-full '
			{...props}
		>
			{children}
		</ol>
	)
}

const ListItemComponent: Components['li'] = ({ children, ...props }) => {
	return (
		<li className='mb-2 break-words w-full max-w-full ' {...props}>
			{children}
		</li>
	)
}

const HorizontalRuleComponent: Components['hr'] = props => {
	return (
		<hr
			className='my-4 border-t border-gray-300 break-words w-full max-w-full '
			{...props}
		/>
	)
}

const LinkComponent: Components['a'] = ({ children, ...props }) => {
	return (
		<a
			className='text-blue-500 hover:underline break-words w-full max-w-full '
			{...props}
		>
			{children}
		</a>
	)
}

const TableHeaderComponent: Components['th'] = ({ children, ...props }) => {
	return (
		<th
			className='text-start align-top text-sm p-2 font-bold break-words w-full max-w-full '
			{...props}
		>
			{children}
		</th>
	)
}

const TableCellComponent: Components['td'] = ({ children, ...props }) => {
	return (
		<td
			className='text-start align-top p-2 break-words w-full max-w-full '
			{...props}
		>
			{children}
		</td>
	)
}

export const components: Partial<Components> = {
	h1: createHeadingComponent(1),
	h2: createHeadingComponent(2),
	h3: createHeadingComponent(3),
	h4: createHeadingComponent(4),
	h5: createHeadingComponent(5),
	h6: createHeadingComponent(6),
	p: Object.assign(ParagraphComponent, { displayName: 'ParagraphComponent' }),
	ul: Object.assign(UnorderedListComponent, {
		displayName: 'UnorderedListComponent',
	}),
	ol: Object.assign(OrderedListComponent, {
		displayName: 'OrderedListComponent',
	}),
	li: Object.assign(ListItemComponent, { displayName: 'ListItemComponent' }),
	hr: Object.assign(HorizontalRuleComponent, {
		displayName: 'HorizontalRuleComponent',
	}),
	a: Object.assign(LinkComponent, { displayName: 'LinkComponent' }),
	th: Object.assign(TableHeaderComponent, {
		displayName: 'TableHeaderComponent',
	}),
	td: Object.assign(TableCellComponent, {
		displayName: 'TableCellComponent',
	}),
}
