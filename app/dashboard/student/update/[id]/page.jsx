"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_SINGLETON } from "../../../../services/API";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConfigProvider, Select, Space, theme } from "antd";

const UpdateUser = ({ params }) => {
  const [user, setUser] = useState({});
  const [uploaded, setUploaded] = useState(false);

  const router = useRouter();

  const options = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      label: i.toString(36) + i,
      value: i.toString(36) + i,
    });
  }

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    API_SINGLETON.get(`/users/${params.id}`)
      .then((result) => {
        setUser(result.data.user);
      })
      .catch((error) => {
        console.log("some error - " + error.message);
      });
  }, []);

  const updateUser = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    API_SINGLETON.put(`/users/${params.id}`, formData)
      .then((result) => {
        console.log(result);
        toast("User updated!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
          theme: "dark",
          position: "bottom-right",
        });
        router.push("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <main className="dark h-screen flex items-center justify-center">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-3 rounded-xl dark-login-input dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center">Update {user.name}</h1>
        <form className="space-y-6" onSubmit={updateUser}>
          <div className="space-y-1 text-sm">
            <label htmlFor="name" className="block dark:text-gray-400">
              Name
            </label>
            <input
              defaultValue={user.name}
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
              defaultValue={user.email}
              type="text"
              name="email"
              id="email"
              placeholder="Ex. john@123.com"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="username" className="block dark:text-gray-400">
              Username
            </label>
            <input
              defaultValue={user.username}
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
            <label htmlFor="role" className="block dark:text-gray-400">
              Role
            </label>
            <input
              disabled
              defaultValue={user.is_admin ? "Admin" : "Student"}
              type="text"
              id="role"
              placeholder="Ex. Student"
              className="w-full px-4 py-3 rounded-md dark:border-gray-900 dark-login-input-disabled dark:text-gray-400 focus:dark:border-violet-400"
            />
          </div>
          <div className="space-y-1 text-sm">
            <label htmlFor="image" className="block dark:text-gray-400">
              Image
            </label>
            <input
              onChange={(e) =>
                e.currentTarget.value == ""
                  ? setUploaded(false)
                  : setUploaded(true)
              }
              accept="[image/jpg]"
              type="file"
              name="image"
              id="image"
              placeholder="Image accepted only!"
              className="w-full px-4 py-3 rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400"
            />
            {!uploaded && (
              <Image
                src={`http://localhost:8080/images/${user?.image}`}
                width={84}
                height={84}
                alt="userImage"
              />
            )}
          </div>

          <button className="block w-full p-3 text-center rounded-sm dark:text-gray-200 dark:bg-violet-500">
            Update
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

export default UpdateUser;
