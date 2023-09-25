"use client";

import { Button, ConfigProvider, DatePicker, Input, Select, theme } from "antd";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { API_SINGLETON } from "../../../../services/API";
import { randomBytes } from "crypto";

const AssignPassword = () => {

  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [password, setPassword] = useState('')

  const fetchStudent = () => {
    API_SINGLETON.get(`/students/${selectedStudent}`).then((result) => {
      const student = result.data.student
      setPassword(student.password ?? "")
    })
  }

  useEffect(() => { if (selectedStudent) fetchStudent() }, [selectedStudent])

  const getStudents = () => {
    API_SINGLETON.get("/students/").then((result) => {
      let changedStudents = [];
      changedStudents = result.data.students.map((student) => {
        return {
          label: student.name,
          value: student._id,
        };
      });
      console.log(changedStudents);
      setStudents(changedStudents);
    });
  };

  const generatePassword = () => {
    if (selectedStudent) {
      const autoPassword = randomBytes(10).toString('hex')
      setPassword(autoPassword)
    }
  }

  const assignPassword = () => {
    if (selectedStudent && password) {
      API_SINGLETON.post(`/students/${selectedStudent}/assign/password`, {
        password
      }).then((result) => {
        console.log(result.data);
        setPassword('')
        setSelectedStudent(null)
      })
    }
  }

  useEffect(() => {
    getStudents()
  }, [])

  return (
    <>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <ToastContainer />
        <div className="dark w-full p-10 flex flex-col gap-4">
          <h1 className="text-gray-100">Assign Password to Student</h1>
          {
            <div className="space-y-1 text-sm">
              <label htmlFor="password" className="block dark:text-gray-400">
                Student
              </label>
              <Select
                placeholder="Select student"
                allowClear
                onClear={() => { setSelectedStudent(null); setPassword("") }}
                size="large"
                style={{ width: 500 }}
                value={selectedStudent}
                onChange={(value) => setSelectedStudent(value)}
                options={students}
              />
            </div>
          }

          <div className="space-y-1 text-sm">
            <label htmlFor="total" className="block dark:text-gray-400 ">
              Password
            </label>
            <Input placeholder="Enter a password" disabled={selectedStudent == null} value={password} onChange={(e) => setPassword(e.currentTarget.value)} style={{ width: 500 }} className="rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400" />
            <div className="grid grid-cols-2 gap-4" style={{ width: 500, marginTop: 10 }}>
              <Button onClick={generatePassword}>Auto Generate</Button>
              <Button onClick={assignPassword}>Assign Password</Button>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default AssignPassword;
