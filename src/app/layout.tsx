import type { Metadata } from "next";
import { Poppins, Oxanium } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";

// Lazy load CustomCarousal, UploadImages, and SelectedImages
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
