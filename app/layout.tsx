import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Varing Group — Real Estate",
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
        <div className="page-enter">
          {children}
        </div>
      </body>
    </html>
  );
}
