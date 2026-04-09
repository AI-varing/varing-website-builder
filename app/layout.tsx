import type { Metadata } from "next";
import "./globals.css";
import StoryblokProvider from "./StoryblokProvider";

export const metadata: Metadata = {
  title: "Targeted Advisors — Real Estate",
  description: "Court-ordered mandates, land assemblies, and income properties across the Lower Mainland and Fraser Valley.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoryblokProvider>
          <div className="page-enter">
            {children}
          </div>
        </StoryblokProvider>
      </body>
    </html>
  );
}
