import "./globals.css";
import { BotIdClient } from "botid/client";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";

const protectedRoutes = [
  {
    path: "/api/chat",
    method: "POST",
  },
];

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-sdk-preview-steps-reasoning.vercel.app"),
  title: "Multi-Step Reasoning with the AI SDK",
  description: "Reasoning with multi-step generations and the AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <BotIdClient protect={protectedRoutes} />
      </head>
      <body>
        <Analytics />
        <Toaster position="top-center" richColors />
        {children}
      </body>
    </html>
  );
}
