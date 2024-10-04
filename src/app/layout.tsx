import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Oxanium, Poppins } from "next/font/google";
import "./globals.css";

const CustomCarousal = dynamic(
  () => import("@/components/shared/custom-carousal"),
  {
    ssr: false,
  },
);

const UploadImages = dynamic(
  () => import("@/components/shared/custom-upload-image"),
  {
    ssr: false,
  },
);

const SelectedImages = dynamic(
  () => import("@/components/shared/custom-select-images"),
  {
    ssr: false,
  },
);

const UploadImagesContextProvider = dynamic(
  () => import("@/context/UploadImagesContext"),
  {
    ssr: false,
  },
);

const StoreContextProvider = dynamic(() => import("@/context/StoreContext"), {
  ssr: false,
});

const SelectImageContextProvider = dynamic(
  () => import("@/context/SelectImageContext"),
  {
    ssr: false,
  },
);

const AxiosContextProvider = dynamic(() => import("@/context/AxiosContext"), {
  ssr: false,
});

const CarousalContextProvider = dynamic(
  () => import("@/context/CarousalContext"),
  { ssr: false },
);

const poppins = Poppins({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const oxanium = Oxanium({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ModtopiaGTA5 - REXTERIA",
  description:
    "Discover a thriving hub for GTA 5 mod enthusiasts at ModtopiaGTA5. Explore an extensive collection of mods, from enhanced graphics to exciting gameplay tweaks. Join a vibrant community of gamers and unleash endless possibilities within the world of Grand Theft Auto V.",
  openGraph: {
    title: "ModtopiaGTA5 - REXTERIA",
    description:
      "Discover a thriving hub for GTA 5 mod enthusiasts at ModtopiaGTA5. Explore an extensive collection of mods, from enhanced graphics to exciting gameplay tweaks. Join a vibrant community of gamers and unleash endless possibilities within the world of Grand Theft Auto V.",
    url: "https://www.modtopiagta5.com",
    type: "website",
    images: [
      {
        url: "https://res.cloudinary.com/dnowxs192/image/upload/v1728039993/m9enaldefswnm6cqh4nu.jpg",
        width: 1200,
        height: 630,
        alt: "ModtopiaGTA5 - Explore GTA 5 Mods",
      },
    ],
    locale: "en_US",
    siteName: "ModtopiaGTA5",
  },
  twitter: {
    card: "summary_large_image",
    title: "ModtopiaGTA5 - REXTERIA",
    description:
      "Discover a thriving hub for GTA 5 mod enthusiasts at ModtopiaGTA5. Explore an extensive collection of mods, from enhanced graphics to exciting gameplay tweaks. Join a vibrant community of gamers and unleash endless possibilities within the world of Grand Theft Auto V.",
    images: [
      "https://res.cloudinary.com/dnowxs192/image/upload/v1728040083/bsq7wlag3pmcpugt44h9.webp",
    ],
  },
  alternates: {
    canonical: "https://www.rexteria.vercel.app/",
  },
  robots: "index, follow",
  icons: {
    icon: "https://res.cloudinary.com/dnowxs192/image/upload/v1728040237/nihmc13uscbpdexrw5pt.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} ${oxanium.className} dark`}>
        <AxiosContextProvider>
          <StoreContextProvider>
            <UploadImagesContextProvider>
              <CarousalContextProvider>
                <SelectImageContextProvider>
                  <main>{children}</main>
                  <Toaster />
                  <CustomCarousal />
                  <UploadImages />
                  <SelectedImages />
                </SelectImageContextProvider>
              </CarousalContextProvider>
            </UploadImagesContextProvider>
          </StoreContextProvider>
        </AxiosContextProvider>
      </body>
    </html>
  );
}
