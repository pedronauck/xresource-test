import axios from 'axios'

export const getBreeds = async () => {
  const res = await axios.get('https://dog.ceo/api/breeds/list/all')
  return Object.keys(res.data.message)
}

export const getDogs = async breed => {
  const res = await axios.get(`https://dog.ceo/api/breed/${breed}/images`)
  return res.data.message
}
