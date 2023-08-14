"use client";

import { useEffect, useState } from "react";
import { API_SINGLETON } from "../../services/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export default function Batches() {
  const [data, setData] = useState([]);

  const router = useRouter();

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Info",
      dataIndex: "info",
      key: "info",
    },
    {
      title: "Timing",
      dataIndex: "timing",
      key: "timing",
      render: (timing) => <p>{timing?.time ?? "Some issue"}</p>,
    },
    {
      title: "Students",
      dataIndex: "students",
      key: "students",
      render: (students) => <p>{students.length}</p>,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link href={`batch/update/${record._id}`}>Update</Link>
          <Popconfirm
            title={`Delete ${record.name}`}
            description="Are you sure to delete this batch?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteBatch(record._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getBatches = () => {
    API_SINGLETON.get("/batches")
      .then((result) => {
        console.log(result.data);
        setData(result.data.batches);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getBatches();
  }, []);

  const deleteBatch = (id) => {
    API_SINGLETON.delete(`/batches/${id}`)
      .then((result) => {
        console.log(result);
        getBatches();
        toast("Batch was deleted!", {
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
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <div className="items-center justify-end md:flex">
            <Button
              type="primary"
              onClick={() => router.push("/dashboard/batch/add")}
            >
              Add Batch
            </Button>
          </div>
          <div className="mt-5 relative h-max overflow-auto">
            <Table columns={columns} dataSource={data} />
          </div>
        </ConfigProvider>
      </div>
    </main>
  );
}
