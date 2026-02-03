import axios from 'axios'
const baseUrl = '/api/login'

const login = async (credentials) => {
	const response = await axios.post(baseUrl, credentials)
	localStorage.setItem('bloglist-user', JSON.stringify(response.data))
	return response.data
}

export default { login }