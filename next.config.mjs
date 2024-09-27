/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["i.pinimg.com", "res.cloudinary.com", "placehold.co"],
  },
};

export default nextConfig;
