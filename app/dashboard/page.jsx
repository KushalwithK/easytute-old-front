"use client";

import { useEffect, useState } from "react";
import { API_SINGLETON } from "../services/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Space, Table, Tag, ConfigProvider, theme } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [data, setData] = useState([]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Enrolled",
      key: "enrolled",
      dataIndex: "enroled",
      render: (_, { enrolled }) => (
        <Tag color={enrolled ? "geekblue" : "volcano"}>
          {enrolled ? "Enrolled" : "Inquired"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link href={`dashboard/student/update/${record._id}`}>Update</Link>
          <Button
            danger
            onClick={() => {
              deleteStudent(record._id);
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const getStudents = () => {
    API_SINGLETON.get("/students")
      .then((result) => {
        console.log(result.data);
        setData(result.data.students);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getStudents();
  }, []);

  const deleteStudent = (id) => {
    API_SINGLETON.delete(`/students/${id}`)
      .then((result) => {
        console.log(result);
        getStudents();
        toast("Student was deleted!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "success",
          theme: "dark",
          position: "bottom-right",
        });
      })
      .catch((error) => {
        toast(error.message, {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
          theme: "dark",
          position: "bottom-right",
        });
      });
  };

  return (
    <main className="w-full my-5 flex">
      <ToastContainer />
      <div className="w-full mx-5 md:px-8">
        <div className="items-start justify-between md:flex"></div>
        <div className="mt-5 relative h-max overflow-auto">
          <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
            <Table columns={columns} dataSource={data} />
          </ConfigProvider>
        </div>
      </div>
    </main>
  );
}
