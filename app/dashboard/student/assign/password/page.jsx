"use client";

import { DatePicker, Select } from "antd";
import React from "react";
import { ToastContainer } from "react-toastify";

const page = () => {
  return (
    <>
      <ToastContainer />
      <div className="dark w-full p-10 flex flex-col gap-4">
        <h1 className="text-gray-100">Assign Tests to Students</h1>
        {
          <div className="space-y-1 text-sm">
            <label htmlFor="password" className="block dark:text-gray-400">
              Tests
            </label>
            <Select
              placeholder="Select test"
              allowClear
              onClear={() => {
                // setSelectedTest(null);
                // setSelectedBatch(null);
                // setStudents(null);
              }}
              size="large"
              style={{ width: 500 }}
              //   onChange={(value) => setSelectedTest(value)}
              //   options={iTests}
            />
          </div>
        }
        {
          <div className="dark space-y-1 text-sm">
            <label htmlFor="password" className="block dark:text-gray-400">
              Batches
            </label>
            <Select
              size="large"
              allowClear
              showSearch={false}
              style={{ width: 500 }}
              placeholder="Select batch"
              onChange={(value) => console.log(value)}
              onClear={() => {}}
              //   options={batches}
            />
          </div>
        }
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
              //   setTimings({
              //     startTime: value[0].toDate().toISOString(),
              //     endTime: value[1].toDate().toISOString(),
              //   });
            }}
          />
        </div>
      </div>
    </>
  );
};

export default page;
