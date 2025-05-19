/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsHmrCache: false,
      serverActions: {
        bodySizeLimit: '10mb' // Increase limit to 10 MB or as needed
      }
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'bhfiemmvzwyvbeocjbnd.supabase.co',
        }
      ],
    },
  };
  
  export default nextConfig;
  
