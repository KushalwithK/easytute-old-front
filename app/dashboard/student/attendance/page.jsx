"use client";

import { Button, Checkbox, ConfigProvider, DatePicker, Input, Select, theme } from "antd";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { API_SINGLETON } from "../../../services/API";
import { randomBytes } from "crypto";

const Attendance = () => {

    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState(null)
    const [courses, setCourses] = useState([]);
    const [attendedStudents, setAttendedStudents] = useState(null);
    const [info, setInfo] = useState({
        date: null,
        courseId: null,
        dayReport: null
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
            setInfo((oldInfo) => {
                return {
                    ...oldInfo,
                    date: shortDate
                }
            })
        }).catch((error) => {
            console.log(error);
        })
    };

    const onBatchChange = (value) => {
        setSelectedBatch(value)
    };

    const onCourseChange = (value) => {
        setInfo((oldInfo) => {
            return {
                ...oldInfo,
                courseId: value
            }
        })
    };

    const onStudentSelectionChange = (values) => {
        console.log(values);
        setAttendedStudents(values)
    }

    const handleAttendanceSubmission = () => {
        API_SINGLETON.post(`/attendance/attend/${info.date}`, {
            ...info,
            batchId: selectedBatch,
            studentIds: attendedStudents,
        }).then((result) => {
            toast.success("Attendance Added!", {
                autoClose: 2000,
                theme: "dark",
                position: "bottom-right",
            });
        }).catch((error) => {
            toast.error(error?.message ?? "Something went wrong!", {
                autoClose: 2000,
                theme: "dark",
                position: "bottom-right",
            });
        })
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
                        <Input placeholder="Enter the day report..." disabled={!selectedBatch} value={info.dayReport} onChange={(e) => setInfo((oldInfo) => {
                            return {
                                ...oldInfo,
                                dayReport: e.target.value
                            }
                        })} style={{ width: 300 }} className="rounded-md dark:border-gray-700 dark-login-input-200 dark:text-gray-100 focus:dark:border-violet-400" />

                    </div>
                    <div className="flex flex-col">
                        <Checkbox.Group disabled={!info.date} className="flex flex-col gap-2" options={students} value={attendedStudents} onChange={onStudentSelectionChange} />
                    </div>
                    <div className="flex">
                        <Button disabled={!info.date || !info.courseId || !info.dayReport || !attendedStudents.length > 0} onClick={handleAttendanceSubmission}>Submit Attendance</Button>
                    </div>
                </div>
            </ConfigProvider>
        </>
    );
};

export default Attendance;
