import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "../packages/ui/styles/globals.css";
import { rewardKit } from "@rewardkit/lib/data";
import { Provider } from "@rewardkit/utils/provider/provider";

const geistSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: rewardKit.default.seoTitle,
  description: rewardKit.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <Provider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
      </html>
    </Provider>
  );
}
