"use client";

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_SINGLETON } from "../../../services/API";
import { useRouter } from "next/navigation";
import { Switch } from "antd";

const AddStudent = () => {
    const [student, setStudent] = useState({});

    const router = useRouter();

    const Add = (event) => {
        event.preventDefault();
        console.log(student);
        API_SINGLETON.post(`/students/`, student)
            .then((result) => {
                console.log(result);
                toast("Student Added!", {
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: "success",
                    theme: "dark",
                    position: "bottom-right",
                });
                router.push("/dashboard/student");
            })
            .catch((error) => {
                toast(error.response.data.message, {
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: "error",
                    theme: "dark",
                    position: "bottom-right",
                });
            });
    };

    return (
        <main className="w-full dark h-screen flex items-center justify-center">
            <ToastContainer />
            <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
                <h1 className="text-2xl font-bold text-center">Add Student</h1>
                <form className="space-y-6" onSubmit={Add}>
                    <div className="space-y-1 text-sm">
                        <label htmlFor="name" className="block dark:text-gray-400">
                            Name
                        </label>
                        <input
                            onChange={(e) => {
                                setStudent({ ...student, name: e.currentTarget.value })
                            }}
                            type="text"
                            name="name"
                            id="name"
                            placeholder="Ex. John Smith"
                            className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                        />
                    </div>
                    <div className="space-y-1 text-sm">
                        <label htmlFor="email" className="block dark:text-gray-400">
                            Email
                        </label>
                        <input
                            onChange={(e) => {
                                setStudent({ ...student, email: e.currentTarget.value })
                            }}
                            type="text"
                            name="email"
                            id="email"
                            placeholder="Ex. john@123.com"
                            className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                        />
                    </div>
                    <div className="space-y-1 text-sm">
                        <label htmlFor="phone" className="block dark:text-gray-400">
                            Phone
                        </label>
                        <input
                            onChange={(e) => {
                                setStudent({ ...student, phone: e.currentTarget.value })
                            }}
                            type="text"
                            name="phone"
                            id="phone"
                            placeholder="Ex. 1234567890"
                            className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                        />
                    </div>
                    <div className="space-y-1 text-sm">
                        <label htmlFor="address" className="block dark:text-gray-400">
                            Address
                        </label>
                        <input
                            onChange={(e) => {
                                setStudent({ ...student, address: e.currentTarget.value })
                            }}
                            type="text"
                            name="address"
                            id="address"
                            placeholder="Ex. Mumbai, Maharashtra"
                            className="w-full px-4 py-3 rounded-md dark:border-gray-900 dark-login-input-200 dark:text-gray-400 focus:dark:border-violet-400"
                        />
                    </div>
                    <div className="space-y-1 text-sm">
                        <label htmlFor="address" className="block dark:text-gray-400 mb-1">
                            Enrolled
                        </label>
                        <Switch checkedChildren="Enrolled" onChange={(e) => {
                            setStudent({ ...student, enrolled: e })
                        }} unCheckedChildren="Inquired" />

                    </div>


                    <button className="block w-full p-3 text-center rounded-sm dark:text-gray-200 dark:bg-violet-500">
                        Add
                    </button>
                </form>

            </div>
        </main>
    );
};

export default AddStudent;
