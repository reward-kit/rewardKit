import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "../packages/ui/styles/globals.css";
import { rewardKit } from "@rewardkit/lib/data";
import { Provider } from "@rewardkit/utils/provider/provider";
import { ThemeProvider } from "@rewardkit/components/theme-provider";
import { Toaster } from 'react-hot-toast';
import { NuqsAdapter } from 'nuqs/adapters/next/app'

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
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <NuqsAdapter>
            <ThemeProvider>
              <Toaster />
              {children}
            </ThemeProvider>
          </NuqsAdapter>
        </body>
      </html>
    </Provider>
  );
}