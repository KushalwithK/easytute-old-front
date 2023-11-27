"use client";

import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Divider,
  Select,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { API_SINGLETON } from "../../../services/API";
import { ToastContainer, toast } from "react-toastify";
const Assign = () => {
  const [iTests, setTests] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [timings, setTimings] = useState(null);
  const [batches, setBatches] = useState(null);
  const [students, setStudents] = useState(null);

  const [checkedList, setCheckedList] = useState([]);

  const checkAll = students?.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < students?.length;

  const getStudentsIds = () => {
    if (selectedBatch)
      API_SINGLETON.get(`/batches/${selectedBatch}/students/ids`)
        .then((result) => {
          console.log(result.data);
          const student_ids = result.data.student_ids;
          const student_names = student_ids.map((student) => {
            return {
              label: student.name,
              value: student._id,
            };
          });

          setStudents(student_names);
        })
        .catch((error) => {
          console.log(error.message);
        });
  };

  useEffect(() => getStudentsIds(), [selectedBatch]);

  const getTests = () => {
    API_SINGLETON.get("/tests/")
      .then((result) => {
        const tests = result.data.testDetails;
        let changedTests = [];
        changedTests = tests.map((test) => {
          return {
            label: test.topic,
            value: test._id,
          };
        });
        setTests(changedTests);
      })
      .catch((error) => {
        console.log(error.message);
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
    getTests();
    getBatches();
  }, []);

  const onChange = (list) => {
    console.log(list);
    setCheckedList(list);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(
      e.target.checked ? students.map((student) => student.value) : []
    );
  };

  const assignTest = () => {
    if (checkedList.length > 0 && timings) {
      console.log(selectedTest);
      API_SINGLETON.post(`/tests/${selectedTest}/attend`, {
        student_ids: checkedList,
        ...timings,
      })
        .then((result) => {
          console.log(result.data);
          toast("Test assigned!", {
            hideProgressBar: true,
            autoClose: 2000,
            type: "success",
            theme: "dark",
            position: "bottom-right",
          });
          // setCheckedList([]);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      if (!timings)
        toast("Test duration must not be null!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
          theme: "dark",
          position: "bottom-right",
        });
      if (checkedList.length <= 0)
        toast("Minimum 1 student if required!", {
          hideProgressBar: true,
          autoClose: 2000,
          type: "error",
          theme: "dark",
          position: "bottom-right",
        });
    }
  };

  return (
    <>
      <ToastContainer />
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <div className="dark w-full p-10 flex flex-col gap-4">
          <h1 className="text-gray-100">Assign Tests to Students</h1>
          {iTests && (
            <div className="space-y-1 text-sm">
              <label htmlFor="password" className="block dark:text-gray-400">
                Tests
              </label>
              <Select
                placeholder="Select test"
                allowClear
                onClear={() => {
                  setSelectedTest(null);
                  setSelectedBatch(null);
                  setStudents(null);
                }}
                size="large"
                style={{ width: 500 }}
                onChange={(value) => setSelectedTest(value)}
                options={iTests}
              />
            </div>
          )}
          {batches && (
            <div className="dark space-y-1 text-sm">
              <label htmlFor="password" className="block dark:text-gray-400">
                Batches
              </label>
              <Select
                value={selectedBatch}
                disabled={selectedTest ? false : true}
                size="large"
                allowClear
                showSearch={false}
                style={{ width: 500 }}
                placeholder="Select batch"
                onChange={(value) => setSelectedBatch(value)}
                onClear={() => {
                  setSelectedBatch(null);
                  setStudents(null);
                }}
                options={batches}
              />
            </div>
          )}
          <div className="space-y-1 text-sm">
            <label htmlFor="total" className="block dark:text-gray-400 ">
              Test duration
            </label>
            <DatePicker.RangePicker
              size="large"
              showTime={{
                format: "HH:mm",
                use12Hours: true,
              }}
              format="YYYY-MM-DD HH:mm"
              onChange={(value, dateString) => {
                setTimings({
                  startTime: value[0].toDate().toISOString(),
                  endTime: value[1].toDate().toISOString(),
                });
              }}
            />
          </div>
          {students && (
            <div>
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                Check all
              </Checkbox>
              <Divider
                style={{
                  margin: "12px 0",
                }}
              />
              <Checkbox.Group
                options={students}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".5rem",
                }}
                value={checkedList}
                onChange={onChange}
              />
              <Divider
                style={{
                  margin: "12px 0",
                }}
              />
              <Button onClick={assignTest}>Assign Test</Button>
            </div>
          )}
        </div>
      </ConfigProvider>
    </>
  );
};

export default Assign;
