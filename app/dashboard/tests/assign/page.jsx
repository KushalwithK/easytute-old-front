"use client";

import { Checkbox, Divider, Select } from "antd";
import { useEffect, useState } from "react";
import { API_SINGLETON } from "../../../services/API";
const Assign = () => {
  const [iTests, setTests] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [batches, setBatches] = useState(null);
  const [studentIds, setStudentsIds] = useState(null);

  const plainOptions = ["Apple", "Pear", "Orange"];

  const [checkedList, setCheckedList] = useState([]);
  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const getStudentsIds = () => {
    if (selectedBatch)
      API_SINGLETON.get(`/batches/${selectedBatch}/students/ids`)
        .then((result) => {
          console.log(result.data);
          setStudentsIds(result.data.student_ids);
        })
        .catch((error) => {
          console.log(error.message);
        });
  };

  useEffect(() => getStudentsIds(), [selectedBatch]);

  const getTests = () => {
    API_SINGLETON.get("/tests/")
      .then((result) => {
        const tests = result.data.tests;
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
    setCheckedList(list);
  };
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  return (
    <>
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
                setStudentsIds(null);
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
                setStudentsIds(null);
              }}
              options={batches}
            />
          </div>
        )}
        {studentIds && (
          <div>
            <h1 className="text-gray-100">
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                Check all
              </Checkbox>
              <Divider />
              <Checkbox.Group
                options={plainOptions}
                value={checkedList}
                onChange={onChange}
              />
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default Assign;
