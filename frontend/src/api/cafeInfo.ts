import apiClient from '../utils/axios'

export const apiGetCafeInfo = async (): Promise<string> => {
	const response = await apiClient.get(`/api/get_cafe_info`)
	return response.data
}

export const apiSaveCafeInfo = async (cafeInfo: string) => {
    const request={
        cafe_info: cafeInfo
    }
    const response = await apiClient.post(`/api/save_cafe_info`, request)
	
    return response.data
}
