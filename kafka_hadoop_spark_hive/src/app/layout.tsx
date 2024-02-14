import { Montserrat } from "next/font/google";
import "./globals.css";

import Provider from "@/components/Provider";

const f = Montserrat({ subsets: ["cyrillic"] });

export const metadata = {
  title: "Teacher's Helper",
  description:
    "datavisioon is a webapp that lets you develop your own model with 0 coding experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={f.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
