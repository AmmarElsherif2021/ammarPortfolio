// layout.tsx
import Footer from "@/_components/footer";
import { CMS_NAME, HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";
import cn from "classnames";
import { ThemeSwitcher } from "@/_components/theme-switcher";
import "./globals.css";
import { uniSans } from "@/lib/fonts";



export const metadata: Metadata = {
  title: `Next.js Blog portfolio of Ammar Elsherif; a javascript developer, built with ${CMS_NAME}`,
  description: `Ammar is a web and app developer, and this is his portfolio oriented to recruiters. Built with ${CMS_NAME}.`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn(uniSans.variable, "font-sans")}>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#000000" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
        <meta name="theme-color" content="#000" />
        <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
        {/* Load retro fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=DM+Sans:opsz,wght@9..40,400;9..40,700&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          "bg-retro-cream text-retro-ink",
          "dark:bg-retro-deep dark:text-retro-cream" // keep dark mode if needed
        )}
      >
        <ThemeSwitcher />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </body>
    </html>
  );
}