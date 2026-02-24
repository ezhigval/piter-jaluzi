import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import HomeLink from "@/components/HomeLink";
import RequestModalProvider from "@/components/RequestModalProvider";
import OpenRequestModalButton from "@/components/OpenRequestModalButton";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Северный Контур - Жалюзи под заказ и ремонт в Санкт-Петербурге",
  description: "Профессиональное изготовление и ремонт жалюзи. Горизонтальные, вертикальные, рулонные шторы. Гарантия 12 месяцев.",
  keywords: "жалюзи, ремонт жалюзи, горизонтальные жалюзи, вертикальные жалюзи, рулонные шторы, Санкт-Петербург",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}
      >
        <RequestModalProvider>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                  <HomeLink href="/" className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white">
                      СЕВЕРНЫЙ КОНТУР
                    </div>
                  </HomeLink>

                  <nav className="hidden md:flex items-center gap-8 text-sm text-slate-700">
                    <HomeLink href="/" className="hover:text-slate-900 transition-colors duration-200 font-medium">
                      Главная
                    </HomeLink>
                    <Link
                      href="/catalog"
                      className="hover:text-slate-900 transition-colors duration-200 font-medium"
                    >
                      Каталог
                    </Link>
                    <Link
                      href="/repair"
                      className="hover:text-slate-900 transition-colors duration-200 font-medium"
                    >
                      Ремонт
                    </Link>
                    <Link
                      href="/reviews"
                      className="hover:text-slate-900 transition-colors duration-200 font-medium"
                    >
                      Отзывы
                    </Link>
                    <Link
                      href="/about"
                      className="hover:text-slate-900 transition-colors duration-200 font-medium"
                    >
                      О нас
                    </Link>
                    <Link
                      href="/contacts"
                      className="hover:text-slate-900 transition-colors duration-200 font-medium"
                    >
                      Контакты
                    </Link>
                  </nav>

                  <div className="hidden md:flex items-center gap-4">
                    <OpenRequestModalButton
                      kind="measure"
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors duration-200 font-medium"
                    >
                      Заказать замер
                    </OpenRequestModalButton>
                  </div>

                  {/* Мобильное меню */}
                  <div className="md:hidden">
                    <button className="text-slate-700 hover:text-slate-900">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1">{children}</main>

            <Footer />
          </div>
        </RequestModalProvider>
      </body>
    </html>
  );
}
