import axios from "axios"

export const API_SINGLETON = axios.create({
    // baseURL: "https://attendance-manager-silk.vercel.app/",
    baseURL: "http://localhost:8080/"
})