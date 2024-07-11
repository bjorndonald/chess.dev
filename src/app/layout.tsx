import Header from "@/components/Common/Header";
import "./globals.css";
import cx from "classnames";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ManHandle, Pistilli, Queen } from "@/media/font";
import { Toaster } from "react-hot-toast";
import { createMetadata } from "@/utils/metadata";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://quickchess.vercel.app"),
  ...createMetadata({
    title: "Quick chess",
    description: "A simple and minimalist chess app",
    keywords: ["chess", "game", "simple", "dark ", "fun"],
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cx(
          inter.className,
          ManHandle.variable,
          Pistilli.variable,
          Queen.variable,
        )}
      >
        <div className="relative min-h-screen overflow-x-hidden">
          <Header />
          <Toaster />
          <NextTopLoader
            color="#A0A0A0"
            initialPosition={0.3}
            crawlSpeed={200}
            height={3}
            crawl={false}
            showSpinner={false}
            easing="ease"
            speed={200}
          />
          {children}
        </div>
      </body>
    </html>
  );
}
