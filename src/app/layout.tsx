import type { Metadata } from "next";
import { Poppins, Oxanium } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";
import SelectedImages from "@/components/shared/custom-select-images";
import UploadImages from "@/components/shared/custom-upload-image";
const CustomCarousal = dynamic(
  () => import("@/components/shared/custom-carousal"),
  {
    ssr: false,
  },
);

const UploadImagesContextProivder = dynamic(
  () => import("@/context/UploadImagesContext"),
  {
    ssr: false,
  },
);

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
          <UploadImagesContextProivder>
            <CarousalContextProvider>
              <SelectImageContextProvider>
                <main>{children}</main>
                <Toaster />
                <CustomCarousal />
                <UploadImages />
                <SelectedImages />
              </SelectImageContextProvider>
            </CarousalContextProvider>
          </UploadImagesContextProivder>
        </AxiosContextProvider>
      </body>
    </html>
  );
}
