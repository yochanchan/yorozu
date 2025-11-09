import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "よろず支援拠点 共通カルテ・全国ダッシュボード（デモ）",
  description:
    "全国47都道府県のよろず支援拠点カルテとダッシュボードのNext.jsデモ画面",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSans.variable} bg-slate-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}
