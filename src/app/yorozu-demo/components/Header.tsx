"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/yorozu-demo", label: "デモ概要" },
  { href: "/yorozu-demo/branch", label: "拠点画面" },
  { href: "/yorozu-demo/hq", label: "全国本部" },
  { href: "/yorozu-demo/stories", label: "成功事例" },
];

export const Header = () => {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-700">
            よろず支援拠点 デモ
          </p>
          <h1 className="text-lg font-bold text-slate-900">
            共通カルテ・全国ダッシュボード（デモ版）
          </h1>
        </div>
        <div className="hidden text-xs text-slate-500 sm:block">
          ※本画面は架空データによるデモです
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl gap-2 px-4 pb-3 text-sm font-medium text-slate-600">
        {navItems.map((item) => {
          const active =
            item.href === "/yorozu-demo"
              ? pathname === item.href
              : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-full px-4 py-1 transition",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "hover:bg-slate-100 hover:text-slate-900",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
};
