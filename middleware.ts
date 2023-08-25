import { NextResponse, NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  let token = req.cookies.get("token");

  const accessableUrls: Array<string> = [
    "http://localhost:3000/dashboard",
    "http://localhost:3000/dashboard/tests",
    "http://localhost:3000/dashboard/tests/results",
    "http://localhost:3000/dashboard/profile",
  ];
  let url = req.url;

  if (url == "http://localhost:3000/") {
    return NextResponse.redirect("http://localhost:3000/dashboard");
  }

  if (token) {
    const res = await fetch("http://localhost:8080/verifyToken", {
      method: "GET",
      headers: { Authorization: `Bearer ${token.value}` },
    });
    const resJson = await res.json();
    const admin = resJson.user.admin;

    if (!admin) {
      if (
        !url.includes("/static/") &&
        !url.includes("favicon.ico") &&
        !accessableUrls.includes(url) &&
        !url.includes("/tests/attend/")
      ) {
        return NextResponse.redirect("http://localhost:3000/dashboard");
      }
    }
  }
  if (!token && url.includes("/dashboard")) {
    console.log("not logged in!");
    return NextResponse.redirect("http://localhost:3000/login");
  }
}
