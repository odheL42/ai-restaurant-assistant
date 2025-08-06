const STORAGE_KEY = 'isCatering'

export const saveIsCatering = (isCatering: boolean) => {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(isCatering))
	} catch (e) {
		console.error(e)
	}
}

export const loadIsCatering = (): boolean | null => {
	try {
		const data = localStorage.getItem(STORAGE_KEY)
		return data ? JSON.parse(data) : null
	} catch (e) {
		console.error(e)
		return null
	}
}
