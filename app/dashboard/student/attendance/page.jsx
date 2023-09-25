"use client";

import { Button, Checkbox, ConfigProvider, DatePicker, Input, Select, theme } from "antd";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { API_SINGLETON } from "../../../services/API";
import { randomBytes } from "crypto";

const Attendance = () => {

    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([])
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null)
    const [courses, setCourses] = useState([]);
    const [attendedStudents, setAttendedStudents] = useState(null);
    const [info, setInfo] = useState({
        date: null,
        courseId: null
    });

    const getCourses = () => {
        API_SINGLETON.get("/courses/").then((result) => {
            let changedBatches = [];
            changedBatches = result.data.courses.map((course) => {
                return {
                    label: course.name,
                    value: course._id,
                };
            });
            console.log(changedBatches);
            setCourses(changedBatches);
        });
    };

    const getBatches = () => {
        API_SINGLETON.get("/batches/").then((result) => {
            let changedBatches = [];
            changedBatches = result.data.batches.map((batch) => {
                return {
                    label: batch.name,
                    value: batch._id,
                };
            });
            console.log(changedBatches);
            setBatches(changedBatches);
        });
    };

    useEffect(() => {
        getCourses()
        getBatches()
    }, [])

    useEffect(() => {
        if (selectedBatch)
            API_SINGLETON.get(`/batches/${selectedBatch}/students/ids`).then((result) => {
                if (result.data.student_ids) {
                    let changedStudents = [];
                    changedStudents = result.data.student_ids.map((student) => {
                        return {
                            label: student.name,
                            value: student._id,
                        };
                    });
                    setStudents(changedStudents);
                }
            }).catch((error) => {
                console.log(error);
            })
    }, [selectedBatch])

    const onDateChange = (date, dateString) => {
        const shortDate = date.$d.toISOString().split('T')[0]
        API_SINGLETON.get(`/attendance/${shortDate}`).then((result) => {
            const attendance = result.data.attendance
            if (attendance) {
                const students = attendance.students
                let changedStudents = [];
                changedStudents = students.map((student) => student._id);
                console.log(changedStudents);
                setAttendedStudents(changedStudents);
            } else {
                setAttendedStudents(null)
            }
        }).catch((error) => {
            console.log(error);
        })
    };

    const onBatchChange = (value) => {
        setSelectedBatch(value)
    };

    const onCourseChange = (value) => {
        console.log(`selected ${value}`);
    };

    const onStudentSelectionChange = (values) => {

    }


    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <>
            <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
                <ToastContainer />
                <div className="dark w-full p-10 flex flex-col gap-4">
                    <div className="flex gap-5 items-center">

                        <Select
                            placeholder="Select a batch"
                            optionFilterProp="children"
                            onChange={onBatchChange}
                            filterOption={filterOption}
                            options={batches}
                        />
                        <DatePicker disabled={!selectedBatch} onChange={onDateChange} />
                        <Select
                            disabled={!selectedBatch}
                            placeholder="Select a course"
                            optionFilterProp="children"
                            onChange={onCourseChange}
                            filterOption={filterOption}
                            options={courses}
                        />
                    </div>
                    <div className="flex flex-col">
                        <Checkbox.Group className="flex flex-col gap-2" options={students} value={attendedStudents} onChange={onStudentSelectionChange} />
                    </div>
                </div>
            </ConfigProvider>
        </>
    );
};

export default Attendance;
