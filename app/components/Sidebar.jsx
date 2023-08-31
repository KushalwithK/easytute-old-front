import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import Cookies from "js-cookie";
import {
  FieldTimeOutlined,
  UserOutlined,
  HomeOutlined,
  BookOutlined,
  UpCircleOutlined,
  PaperClipOutlined,
  LogoutOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { LuNewspaper } from "react-icons/lu";
import { usePathname, useRouter } from "next/navigation";
import { API_SINGLETON } from "../services/API";

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

  const [isAdmin, setIsAdmin] = useState(null);

  const [current, setCurrent] = useState(pathName);

  useEffect(() => {
    console.log(pathName);
    setCurrent(pathName);
  }, [pathName]);

  const verifyToken = async () => {
    const token = Cookies.get("token");
    const res = await fetch("https://attendance-manager-silk.vercel.app/verifyToken", {
      method: "GET",
      headers: { Authorization: `BEARER ${token}` },
    });
    const resJson = await res.json();
    const admin = resJson.user.admin;
    setIsAdmin(admin);
  };

  useEffect(() => {
    verifyToken();
  }, []);

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
  const items =
    isAdmin == null
      ? []
      : [
        getItem("Accessibles"),
        getItem("Dashboard", "/dashboard", <HomeOutlined />),
        isAdmin &&
        getItem("Students", "/dashboard/student", <UserOutlined />),
        isAdmin && getItem("Courses", "/dashboard/course", <BookOutlined />),
        isAdmin &&
        getItem("Batches", "/dashboard/batch", <FieldTimeOutlined />),
        getItem("Actions"),
        isAdmin &&
        getItem(
          "Create Tests",
          "/dashboard/tests/create",
          <BookOutlined />
        ),
        isAdmin &&
        getItem(
          "Assign Tests",
          "/dashboard/tests/assign",
          <UpCircleOutlined />
        ),
        isAdmin &&
        getItem(
          "Assign Password to Student",
          "/dashboard/student/assign/password",
          <LockOutlined />
        ),
        !isAdmin &&
        getItem("My Tests", "/dashboard/tests", <PaperClipOutlined />),
        !isAdmin &&
        getItem(
          "Test Results",
          "/dashboard/tests/results",
          <LuNewspaper />
        ),
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
