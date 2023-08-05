"use client"

import { useEffect, useState } from "react"
import { API_SINGLETON } from "./services/API"
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Cookies from "js-cookie";
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation";


export default function Home() {
  const [users, setUsers] = useState([])

  const router = useRouter()

  const getUsers = () => {
    API_SINGLETON.get('/users').then((result) => {
      console.log(result.data);
      setUsers(result.data.data)
    }).catch((error) => {
      console.log(error.message);
    })
  }

  const logoutUser = () => {
    Cookies.remove('token')
    router.push('/login')
  }

  useEffect(() => {
    getUsers()
  }, [])

  const deleteStudent = (id) => {
    API_SINGLETON.delete(`/users/${id}`).then(result => {
      console.log(result);
      getUsers()
      toast("User was deleted!", { hideProgressBar: true, autoClose: 2000, type: 'success', theme: "dark", position: 'bottom-right' })
    }).catch(error => {
      toast(error.message, { hideProgressBar: true, autoClose: 2000, type: 'warning', theme: "dark", position: 'bottom-right' })
    })
  }

  return (
    <main className="w-screen my-10 flex items-center">
      <ToastContainer />
      <div className="w-screen mx-20 px-4 md:px-8">
        <div className="items-start justify-between md:flex">
          <button
            onClick={logoutUser}
            className="px-6 py-2 text-gray-100 border rounded-lg duration-100 hover:border-indigo-600 active:shadow-lg"
          >
            Logout
          </button>
        </div>
        <div className="mt-12 relative h-max overflow-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="text-gray-200 font-medium border-b">
              <tr>
                <th className="py-3 pr-6">Name</th>
                <th className="py-3 pr-6">Email</th>
                <th className="py-3 pr-6">Role</th>
                <th className="py-3 pr-6">Username</th>
                <th className="py-3 pr-6">Image</th>
                <th className="py-3 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-100 divide-y">
              {
                users.map((item, idx) => (
                  <tr key={idx}>
                    <td className="pr-6 py-4 whitespace-nowrap">{item.name}</td>
                    <td className="pr-6 py-4 whitespace-nowrap">{item.email}</td>
                    <td className="pr-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-2 rounded-full font-semibold text-xs ${item.is_admin ? "text-green-600 bg-green-50" : "text-blue-600 bg-blue-50"}`}>
                        {item.is_admin ? "Admin" : "Student"}
                      </span>
                    </td>
                    <td className="pr-6 py-4 whitespace-nowrap">{item.username}</td>
                    <td className="pr-6 py-4 whitespace-nowrap"><Image src={'http://localhost:8080/images/' + item.image} width={64} height={64} /></td>
                    <td className="text-right whitespace-nowrap">
                      {item.is_admin && <p className="mx-4">Can't perform actions!</p>}
                      {!item.is_admin && <><Link href={`/student/update/${item._id}`} className="py-1.5 px-3 text-gray-200 hover:text-gray-50 duration-150 hover:bg-blue-600 border hover:border-none rounded-lg">
                        Update
                      </Link>
                        <button onClick={() => {
                          deleteStudent(item._id)
                        }} className="py-1.5 px-3 mx-4 text-gray-200 hover:text-gray-50 duration-150 hover:bg-red-600 border hover:border-none rounded-lg">
                          Delete
                        </button></>}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
