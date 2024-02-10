/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // eslint-disable-next-line
    config.externals.push("@node-rs/argon2", "@node-rs/bcrypt")
    // eslint-disable-next-line
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
    ],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
