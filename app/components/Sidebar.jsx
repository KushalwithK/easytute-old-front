import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import Cookies from "js-cookie";
import {
  FieldTimeOutlined,
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  UpCircleOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";

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
  const router = useRouter();
  const pathName = usePathname();

  const [current, setCurrent] = useState(pathName);

  useEffect(() => {
    console.log(pathName);
    setCurrent(pathName);
  }, [pathName]);

  const onClick = (e) => {
    if (e.key && e.key !== "USER::LOGOUT") {
      setCurrent(e.key);
      router.push(e.key);
    }
    if (e.key === "USER::LOGOUT") {
      Cookies.remove("token");
      router.push("/login");
    }
  };
  const items = [
    getItem("Accessibles"),
    getItem("Dashboard", "/dashboard", <HomeOutlined />),
    getItem("Students", "/dashboard/student", <UserOutlined />),
    getItem("Courses", "/dashboard/course", <BookOutlined />),
    getItem("Batches", "/dashboard/batch", <FieldTimeOutlined />),
    getItem("Actions"),
    getItem("Create Tests", "/dashboard/tests/create", <BookOutlined />),
    getItem("Assign Tests", "/dashboard/tests/assign", <UpCircleOutlined />),
    getItem("Profile"),
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
