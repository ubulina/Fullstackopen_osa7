import axios from 'axios'
const baseUrl = '/api/blogs'

const create = async (newObject) => {
  
  const id = newObject.id  
    
  const response = await axios.post(`${baseUrl}/${id}/comments`, newObject)
  
  return response.data

}
// eslint-disable-next-line import/no-anonymous-default-export
export default { create }