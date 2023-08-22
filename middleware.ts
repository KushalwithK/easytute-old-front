import { NextResponse, NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
    let token = req.cookies.get('token')
    let url = req.url


    if (url == "http://localhost:3000/") {
        return NextResponse.redirect('http://localhost:3000/dashboard')
    }

    // if (token && (url.includes('/login') || url.includes('/register'))) {
    //     console.log("Already logged in.");
    //     return NextResponse.redirect('http://localhost:3000/')
    // }
    else if (!token && url.includes('/dashboard')) {
        console.log('not logged in!');
        return NextResponse.redirect('http://localhost:3000/login')
    }
}