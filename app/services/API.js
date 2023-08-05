import axios from "axios"

export const API_SINGLETON = axios.create({
    baseURL: "http://localhost:8080/"
})