import { NextResponse, NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {

  const baseURL = process.env.baseUrl

  let token = req.cookies.get("token");


  const accessableUrls: Array<string> = [
    baseURL + "dashboard",
    baseURL + "dashboard/tests",
    baseURL + "dashboard/tests/results",
    baseURL + "dashboard/profile",
  ];
  let url = req.url;

  if (url == baseURL) {
    return NextResponse.redirect(baseURL + "dashboard");
  }

  if (token) {
    const res = await fetch("https://attendance-manager-silk.vercel.app/verifyToken", {
      method: "GET",
      headers: { Authorization: `Bearer ${token.value}` },
    });
    const resJson = await res.json();
    if (res.status == 401) {
      req.cookies.clear()
      return NextResponse.redirect(baseURL + 'login')
    }

    const admin = resJson.user.admin

    if (!admin) {
      if (
        !url.includes("/static/") &&
        !url.includes("favicon.ico") &&
        !accessableUrls.includes(url) &&
        !url.includes("/tests/attend/")
      ) {
        return NextResponse.redirect(baseURL + "dashboard");
      }
    }
  }
  if (!token && url.includes("/dashboard")) {
    console.log("not logged in!");
    return NextResponse.redirect(baseURL + "login");
  }
}
