import React, { useState } from "react";
import { Menu } from "antd";
import Cookies from "js-cookie";
import {
  FieldTimeOutlined,
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  UserAddOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

function getItem(label, key, icon, children, theme) {
  return {
    key,
    icon,
    children,
    label,
    theme,
  };
}

const Sidebar = () => {
  const [current, setCurrent] = useState("/");

  const router = useRouter();

  const onClick = (e) => {
    if (e.key != "-1" && e.key !== "USER::LOGOUT") {
      setCurrent(e.key);
    }
    if (e.key === "USER::LOGOUT") {
      Cookies.remove("token");
      router.push("/login");
    }
  };
  const items = [
    getItem("Accessibles", "-1"),
    getItem("Dashboard", "/", <HomeOutlined />),
    getItem("Students", "/students", <UserOutlined />),
    getItem("Courses", "/courses", <BookOutlined />),
    getItem("Batches", "/batches", <FieldTimeOutlined />),
    getItem("Actions", "-1"),
    getItem(
      "+ / - Student to Batch",
      "/students/batches/add",
      <UserAddOutlined />
    ),
    getItem(
      "Get Students of Batch",
      "/batches/students",
      <UserSwitchOutlined />
    ),
    getItem("Profile", "-1"),
    getItem("Logout", "USER::LOGOUT", <LogoutOutlined />),
  ];
  return (
    <Menu
      onClick={onClick}
      style={{
        width: 300,
        background: "#131313",
        padding: "1rem",
      }}
      openKeys={["sub1"]}
      selectedKeys={[current]}
      mode="vertical"
      theme="dark"
      items={items}
      getPopupContainer={function test(node) {
        return node.parentNode;
      }}
    />
  );
};
export default Sidebar;
