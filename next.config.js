/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'localhost',
                port: '8080',
            },
        ],
    }


}

module.exports = nextConfig
