import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => { token = `Bearer ${newToken}` }

const getAll = async () => {
  const request = await axios.get(baseUrl)
  return request.data
}

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject,
    {
      headers: { Authorization: token }
    })
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject,
    {
      headers: { Authorization: token }
    })
  return response.data
}

export default { getAll, create, update, setToken }