"use client";

import { useEffect, useRef, useState } from "react";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function Home() {
  const [data, setData] = useState([]);

  const router = useRouter();
  const pdfRef = useRef(null);

  const downloadPdf = () => {
    const input = pdfRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("test.pdf");
    });
  };

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
          <Link href={`student/update/${record._id}`}>Update</Link>
          <Popconfirm
            title={`Delete ${record.name}`}
            description="Are you sure to delete this student?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteStudent(record._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
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
      <div className="w-full mx-5 md:px-8" ref={pdfRef}>
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <div className="items-center justify-end md:flex">
            <Button type="primary" onClick={downloadPdf}>
              Download PDF
            </Button>
            <Button
              type="primary"
              onClick={() => router.push("/dashboard/student/add")}
            >
              Add Student
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
