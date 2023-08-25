"use client";

import { useEffect, useState } from "react";
import { API_SINGLETON } from "../../services/API";
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

  const getTests = () => {
    API_SINGLETON.get(`/tests/byStudentId/${studentId}`)
      .then((result) => {
        console.log(result.data.tests);
        setData(result.data.tests);
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
      getTests();
    }
  }, [studentId]);

  const columns = [
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      render: (_, record) => <p>{record?.testDetail.topic}</p>,
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
      key: "passingMarks",
      render: (_, record) => <p>{record?.testDetail.passingMarks}</p>,
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
      key: "totalMarks",
      render: (_, record) => <p>{record?.testDetail.totalMarks}</p>,
    },
    {
      title: "Questions",
      dataIndex: "questions",
      key: "questions",
      render: (_, record) => <p>{record?.testDetail.questions.length}</p>,
    },
    {
      title: "Start time",
      key: "startTime",
      dataIndex: "startTime",
      render: (_, record) => (
        <p>{new Date(record?.startTime).toLocaleString()}</p>
      ),
    },
    {
      title: "End time",
      key: "endTime",
      dataIndex: "endTime",
      render: (_, record) => (
        <p>{new Date(record?.endTime).toLocaleString()}</p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() =>
              router.push(`/dashboard/tests/attend/${record?._id}`)
            }
          >
            Attend Test
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <main className="w-full my-5 flex">
      <ToastContainer />
      <div className="w-full mx-5 md:px-8">
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <div className="items-center justify-start md:flex">
            <p className="text-gray-100">Tests for you</p>
          </div>
          <div className="mt-5 relative h-max overflow-auto">
            <Table columns={columns} dataSource={data} />
          </div>
        </ConfigProvider>
      </div>
    </main>
  );
}
