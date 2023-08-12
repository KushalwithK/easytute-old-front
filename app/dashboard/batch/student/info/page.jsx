"use client";

import { Button, ConfigProvider, Input, Space, theme } from "antd";
import React from "react";

const BatchesStudentInfo = () => {
  return (
    <div>
      <ConfigProvider theme={{ theme: theme.darkAlgorithm }}></ConfigProvider>
      <Space.Compact style={{ width: "100%" }}>
        <Input defaultValue="Combine input and button" />
        <Button type="primary">Submit</Button>
      </Space.Compact>
    </div>
  );
};

export default BatchesStudentInfo;
