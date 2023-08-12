"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_SINGLETON } from "../../../../services/API";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConfigProvider, Select, Space, Switch, theme } from "antd";

const UpdateCourse = ({ params }) => {
  const [course, setCourse] = useState({});

  const router = useRouter();

  const getCourse = () => {
    API_SINGLETON.get(`/courses/${params.id}`).then((result) => {
      setCourse(result.data.course);
    });
  };

  useEffect(() => getCourse());

  const updateCourse = (event) => {
    event.preventDefault();
    console.log(course);
    API_SINGLETON.put(`/courses/${params.id}`, course)
      .then((result) => {
        console.log(result);
        toast("Course updated!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
          theme: "dark",
          position: "bottom-right",
        });
        router.push("/dashboard/course");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <main className="w-full dark h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center">Update {course.name}</h1>
        <form className="space-y-6" onSubmit={updateCourse}>
          <div className="space-y-1 text-sm">
            <label htmlFor="name" className="block dark:text-gray-400">
              Name
            </label>
            <input
              defaultValue={course.name}
              onChange={(e) => {
                setCourse({ ...course, name: e.currentTarget.value });
              }}
              type="text"
              name="name"
              id="name"
              placeholder="Ex. John Smith"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="desc" className="block dark:text-gray-400">
              Desc
            </label>
            <textarea
              defaultValue={course.desc}
              onChange={(e) => {
                setCourse({ ...course, desc: e.currentTarget.value });
              }}
              name="desc"
              id="desc"
              placeholder="Ex. Morning Batch"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="duration" className="block dark:text-gray-400">
              Duration
            </label>
            <input
              defaultValue={course.duration}
              onChange={(e) => {
                setCourse({ ...course, duration: e.currentTarget.value });
              }}
              type="text"
              name="duration"
              id="duration"
              placeholder="Ex. 6 Months"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="fees" className="block dark:text-gray-400">
              Fees
            </label>
            <input
              defaultValue={course.fees}
              onChange={(e) => {
                setCourse({ ...course, fees: e.currentTarget.value });
              }}
              type="text"
              name="fees"
              id="fees"
              placeholder="Ex. 25000"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>

          <button className="block w-full p-3 text-center rounded-sm dark:text-gray-200 dark:bg-violet-500">
            Update Course
          </button>
        </form>
      </div>
    </main>
  );
};

export default UpdateCourse;
