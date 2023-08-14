"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_SINGLETON } from "../../../services/API";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConfigProvider, Select, Space, Switch, theme } from "antd";

const AddBatch = () => {
  const [batch, setBatch] = useState({});
  const [batchTimings, setTimings] = useState([]);

  const router = useRouter();

  const getBatchTimings = () => {
    API_SINGLETON.get("/batchTimings")
      .then((result) => {
        const timings = result.data.timings;
        let changedTimings = [
          { value: "SELECT", label: "Select Timing", disabled: true },
        ];
        changedTimings = timings.map((timing) => {
          return {
            value: timing._id,
            label: timing.time,
          };
        });
        setTimings(changedTimings);
      })
      .catch((error) => {
        toast(error.response.data.message);
      });
  };

  const addBatch = (event) => {
    event.preventDefault();
    console.log(batch);
    API_SINGLETON.post(`/batches/`, batch)
      .then((result) => {
        console.log(result);
        toast("Batch added!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
          theme: "dark",
          position: "bottom-right",
        });
        router.push("/dashboard/batch");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getBatchTimings();
  }, []);

  return (
    <main className="w-full dark h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center">Add Batch</h1>
        <form className="space-y-6" onSubmit={addBatch}>
          <div className="space-y-1 text-sm">
            <label htmlFor="name" className="block dark:text-gray-400">
              Name
            </label>
            <input
              onChange={(e) => {
                setBatch({ ...batch, name: e.currentTarget.value });
              }}
              type="text"
              name="name"
              id="name"
              placeholder="Ex. John Smith"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="info" className="block dark:text-gray-400">
              Info
            </label>
            <textarea
              onChange={(e) => {
                setBatch({ ...batch, info: e.currentTarget.value });
              }}
              name="info"
              id="info"
              placeholder="Ex. This batch is good"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <div className="space-y-1 text-sm">
              <label htmlFor="timing" className="block dark:text-gray-400">
                Timing
              </label>
              <Select
                aria-required
                placeholder={"Select Timing"}
                size="large"
                style={{ width: "100%" }}
                onChange={(e) => {
                  console.log(e);
                  setBatch({ ...batch, timing_id: e });
                }}
                options={batchTimings}
              />
            </div>
          </ConfigProvider>
          <button className="block w-full p-3 text-center rounded-sm dark:text-gray-200 dark:bg-violet-500">
            Add Batch
          </button>
        </form>
      </div>
    </main>
  );
};

export default AddBatch;
