"use client";

import { useEffect, useState } from "react";
import { API_SINGLETON } from "../../../services/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import {
  Button,
  Space,
  Table,
  Tag,
  ConfigProvider,
  theme,
  Popconfirm,
} from "antd";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [data, setData] = useState([]);

  const [studentId, setStudentId] = useState(null);

  const router = useRouter();

  const fetchStudentId = async () => {
    const token = Cookies.get("token");
    const res = await fetch("http://localhost:8080/verifyToken", {
      method: "GET",
      headers: { Authorization: `BEARER ${token}` },
    });
    const resJson = await res.json();
    const studentId = resJson.user.user._id;
    setStudentId(studentId);
  };

  const getResults = () => {
    API_SINGLETON.get(`/tests/results/student/${studentId}`)
      .then((result) => {
        console.log(result.data.results);
        setData(result.data.results);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    fetchStudentId();
  }, []);

  useEffect(() => {
    if (studentId) {
      getResults();
    }
  }, [studentId]);

  const columns = [
    {
      title: "Test",
      dataIndex: "test",
      key: "test",
      render: (_, record) => <p>{record?.test._id}</p>,
    },
    {
      title: "Received Marks",
      dataIndex: "receivedMarks",
      key: "receivedMarks",
      render: (_, record) => <p>{record?.marks.receivedMarks}</p>,
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
      key: "totalMarks",
      render: (_, record) => <p>{record?.marks.totalMarks}</p>,
    },
    {
      title: "Start time",
      key: "startTime",
      dataIndex: "startTime",
      render: (_, record) => (
        <p>{new Date(record?.test.startTime).toLocaleString()}</p>
      ),
    },
    {
      title: "End time",
      key: "endTime",
      dataIndex: "endTime",
      render: (_, record) => (
        <p>{new Date(record?.test.endTime).toLocaleString()}</p>
      ),
    },
  ];

  return (
    <main className="w-full my-5 flex">
      <ToastContainer />
      <div className="w-full mx-5 md:px-8">
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <div className="items-center justify-start md:flex">
            <p className="text-gray-100">Results for you</p>
          </div>
          <div className="mt-5 relative h-max overflow-auto">
            <Table columns={columns} dataSource={data} />
          </div>
        </ConfigProvider>
      </div>
    </main>
  );
}
