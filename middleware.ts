import { NextResponse, NextRequest } from "next/server";
import Cookies from "js-cookie";

export default async function middleware(req: NextRequest) {

  const baseURL = req.nextUrl.clone().origin + "/";

  let token = req.cookies.get("token");

  const accessableUrls: Array<string> = [
    baseURL + "dashboard",
    baseURL + "dashboard/tests",
    baseURL + "dashboard/tests/results",
    baseURL + "dashboard/profile",
  ];
  let url = req.url;

  if (url == baseURL) {
    const nextUrl = req.nextUrl.clone();
    console.log("Sending to dashboard");

    nextUrl.pathname = "/dashboard";
    return NextResponse.redirect(nextUrl);
  }

  if (token) {
    if (url.endsWith("/login")) {
      return NextResponse.redirect(baseURL + "dashboard");
    }
    const res = await fetch(
      "http://localhost:8080/verifyToken",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token.value}` },
      }
    );
    const resJson = await res.json();
    if (res.status == 401) {
      Cookies.remove("token");
      Cookies.remove("userId");
      return NextResponse.redirect(baseURL + "login");
    }

    const admin = resJson.user.admin;

    if (!admin) {
      if (
        !url.includes("/static/") &&
        !url.includes("favicon.ico") &&
        !accessableUrls.includes(url) &&
        !url.includes("/tests/attend/")
      ) {
        console.log("Sending to dashboard");
        return NextResponse.redirect(baseURL + "dashboard");
      }
    }
  } else {
    if (url.includes("/dashboard")) {
      console.log("Sending to dashboard");
      return NextResponse.redirect(baseURL + "login");
    }
  }
}
