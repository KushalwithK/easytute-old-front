import { NextResponse, NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
    let token = req.cookies.get('token')
    
    if(token) {
        const res = await fetch("http://localhost:8080/verifyToken", { method: "GET", headers: { "Authorization": `BEARER ${token.value}` }, });
        const resJson = await res.json()
    }
    // const admin = resJson.user.admin
    const admin = false;
    let url = req.url

    if (url == "http://localhost:3000/") {
        return NextResponse.redirect('http://localhost:3000/dashboard')
    }

    // if((!url.endsWith('/dashboard'))) {
    //     return NextResponse.redirect("http://localhost:3000/")
    // }

    // if (token && (url.includes('/login') || url.includes('/register'))) {
    //     console.log("Already logged in.");
    //     return NextResponse.redirect('http://localhost:3000/')
    // }
    if (!token && url.includes('/dashboard')) {
        console.log('not logged in!');
        return NextResponse.redirect('http://localhost:3000/login')
    }

    

}