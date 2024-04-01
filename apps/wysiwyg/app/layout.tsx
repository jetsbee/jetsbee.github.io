import "@repo/ui/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Editor",
  description: "WYSIWYG editor for blogging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
