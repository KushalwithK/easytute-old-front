"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_SINGLETON } from "../../../../services/API";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConfigProvider, Select, Space, Switch, theme } from "antd";

const AddBatchTiming = () => {
    const [batch, setBatch] = useState({});

    const router = useRouter();

    const addBatch = (event) => {
        event.preventDefault();
        console.log(batch);
        API_SINGLETON.post(`/batchTimings/`, batch)
            .then((result) => {
                console.log(result);
                toast("Batch Timing added!", {
                    hideProgressBar: true,
                    autoClose: 2000,
                    type: "success",
                    theme: "dark",
                    position: "bottom-right",
                });
                router.push("/dashboard/batch/timings");
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    return (
        <main className="w-full dark h-screen flex items-center justify-center">
            <ToastContainer />
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
                    <h1 className="text-2xl font-bold text-center">Add Batch Timing</h1>
                    <form className="space-y-6" onSubmit={addBatch}>
                        <div className="space-y-1 text-sm">
                            <label htmlFor="name" className="block dark:text-gray-400">
                                Time
                            </label>
                            <input
                                onChange={(e) => {
                                    setBatch({ ...batch, time: e.currentTarget.value });
                                }}
                                type="text"
                                name="time"
                                id="time"
                                placeholder="Ex. 1PM to 1AM"
                                className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
                            />
                        </div>
                        <button className="block w-full p-3 text-center rounded-sm dark:text-gray-200 dark:bg-violet-500">
                            Add Batch
                        </button>
                    </form>
                </div>
            </ConfigProvider>
        </main>
    );
};

export default AddBatchTiming;
