"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { API_SINGLETON } from "../../../../services/API";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConfigProvider, Select, Space, Switch, theme } from "antd";

const UpdateBatch = ({ params }) => {
  const [batch, setBatch] = useState({});
  const [students, setStudents] = useState([]);
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

  const getStudents = () => {
    API_SINGLETON.get("/students/").then((result) => {

      const filteredStudents = result.data.students.filter((student) => student.enrolled)

      let changedStudents = [];
      changedStudents = filteredStudents.map((student) => {
        return {
          label: student.name,
          value: student._id,
        };
      });
      console.log(changedStudents);
      setStudents(changedStudents);
    });
  };

  const getBatches = () => {
    API_SINGLETON.get(`/batches/${params.id}`)
      .then(async (result) => {
        setBatch(result.data.batch);
        let batchStudents = [];
        batchStudents = await result.data.batch.students.map((student) => {
          return student._id;
        });
        console.log(batchStudents);
        // setBatch({ ...batch, students: batchStudents });
        setBatch({ ...result.data.batch, students: batchStudents });
      })
      .catch((error) => {
        console.log("some error - " + error.message);
      });
  };

  useEffect(() => {
    getBatches();
    getStudents();
    getBatchTimings();
  }, []);

  const updateBatch = (event) => {
    event.preventDefault();
    console.log(batch);
    API_SINGLETON.put(`/batches/${params.id}`, batch)
      .then((result) => {
        console.log(result);
        toast("Batch updated!", {
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

  return (
    <main className="w-full dark h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center">Update {batch.name}</h1>
        <form className="space-y-6" onSubmit={updateBatch}>
          <div className="space-y-1 text-sm">
            <label htmlFor="name" className="block dark:text-gray-400">
              Name
            </label>
            <input
              defaultValue={batch.name}
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
              defaultValue={batch.info}
              onChange={(e) => {
                setBatch({ ...batch, info: e.currentTarget.value });
              }}
              name="info"
              id="info"
              placeholder="Ex. Morning Batch"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <div className="space-y-1 text-sm">
              <label htmlFor="timing" className="block dark:text-gray-400">
                Timing
              </label>
              {batch.timing && (
                <Select
                  placeholder={"Select Timing"}
                  size="large"
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    console.log(e);
                    setBatch({ ...batch, timing_id: e });
                  }}
                  defaultValue={batch.timing._id}
                  options={batchTimings}
                />
              )}
            </div>
            <div className="space-y-1 text-sm">
              <label htmlFor="address" className="block dark:text-gray-400">
                Students
              </label>
              {batch.students && (
                <Select
                  mode="multiple"
                  size="large"
                  allowClear
                  showSearch={false}
                  style={{ width: "100%" }}
                  placeholder="Please select"
                  defaultValue={batch.students}
                  autoFocus
                  onChange={(e) => setBatch({ ...batch, students: e })}
                  options={students}
                />
              )}
            </div>
          </ConfigProvider>
          <button className="block w-full p-3 text-center rounded-sm dark:text-gray-200 dark:bg-violet-500">
            Update
          </button>
        </form>
      </div>
    </main>
  );
};

export default UpdateBatch;
