import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000",
})

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("@PetWorking:user")

    if (storedUser) {
      const { token } = JSON.parse(storedUser)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default api

