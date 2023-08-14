"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { API_SINGLETON } from "../services/API";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";

const Login = () => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const registerUser = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    API_SINGLETON.post("/register", formData)
      .then((result) => {
        console.log(result);
        Cookies.set("token", result.data.token);
        console.log(Cookies);
        setLoading(false);
        router.push("/");
      })
      .catch((error) => {
        setLoading(false);
        toast(error.message, {
          hideProgressBar: true,
          autoClose: 2000,
          type: "warning",
          theme: "dark",
          position: "bottom-right",
        });
      });
  };

  return (
    <main className="dark h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center">Register</h1>
        <form className="space-y-6" onSubmit={registerUser}>
          <div className="space-y-1 text-sm">
            <label htmlFor="name" className="block dark:text-gray-400">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Ex. John Smith"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="username" className="block dark:text-gray-400">
              Username
            </label>
            <input
              onChange={(event) => {
                if (event.currentTarget.value.includes(" ")) {
                  event.currentTarget.value = event.currentTarget.value.replace(
                    " ",
                    "_"
                  );
                }
                event.currentTarget.value =
                  event.currentTarget.value.toLowerCase();
              }}
              type="text"
              name="username"
              id="username"
              placeholder="Ex. imjohn"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="email" className="block dark:text-gray-400">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Ex. john@test.com"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>

          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block dark:text-gray-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Ex. 123"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
            <div className="flex justify-end text-xs dark:text-gray-400">
              <a rel="noopener noreferrer" className="mt-2" href="#">
                Forgot Password?
              </a>
            </div>
          </div>

          <button className="block w-full p-3 text-center rounded-sm dark:text-gray-200 dark:bg-violet-500">
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
        <div className="flex justify-center  pt-4 space-x-4">
          <p className="text-xs text-center sm:px-6 dark:text-gray-400">
            Already having an account?
            <Link
              rel="noopener noreferrer"
              href="/login"
              className="ml-2 underline dark:text-gray-100"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
