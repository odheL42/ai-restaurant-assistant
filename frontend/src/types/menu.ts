export interface CPFCModel {
	calories: number
	proteins: number
	fats: number
	carbs: number
}

export interface DBDish {
	index: string
	title: string
	price: number
	category?: string
	quantity?: string
	stock?: boolean
	notes?: string
	cpfc?: CPFCModel
}

// Плоский словарь для быстрого поиска по id
export type DishByIdMap = Record<string, DBDish>
