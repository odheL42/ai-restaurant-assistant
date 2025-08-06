export type DBDishContext = 'кейтеринг' | 'банкет' | 'полуфабрикаты'
export type DBDishCategory =
	| 'бутерброды'
	| 'блинчики'
	| 'сэндвичи'
	| 'выпечка'
	| 'канапе'
	| 'тарталетки'
	| 'напитки'
	| 'десерты'
	| 'салаты'
	| 'ассорти'
	| 'основные блюда'
	| 'дополнительно'
	| 'сырники'
	| 'мясные и рыбные'
	| 'овощные'
	| 'ручная лепка'
	| 'блины'

export interface DBDish {
	index: string
	title: string
	price: number
	context: DBDishContext
	category: DBDishCategory
	quantity?: string
	composition?: string
}

// Само меню — вложенный объект с массивами блюд
export type MenuStructure = {
	[context in DBDishContext]: {
		[category in DBDishCategory]?: DBDish[]
	}
}

// Плоский словарь для быстрого поиска по id
export type DishByIdMap = Record<string, DBDish>
