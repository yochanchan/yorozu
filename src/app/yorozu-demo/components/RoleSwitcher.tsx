"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

type RoleCard = {
  title: string;
  description: string;
  href: string;
  accent: string;
};

type RoleSwitcherProps = {
  roles: RoleCard[];
};

export const RoleSwitcher = ({ roles }: RoleSwitcherProps) => (
  <div className="grid gap-4 md:grid-cols-2">
    {roles.map((role) => (
      <Link
        key={role.href}
        href={role.href}
        className="yorozu-card group flex flex-col justify-between rounded-xl border px-6 py-5 transition hover:-translate-y-1 hover:shadow-lg"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Role
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">
            {role.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {role.description}
          </p>
        </div>
        <div className="mt-6 flex items-center justify-between text-sm font-semibold text-blue-700">
          <span>画面へ進む</span>
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </div>
        <div
          className="mt-4 h-1 rounded-full"
          style={{ backgroundColor: role.accent }}
        />
      </Link>
    ))}
  </div>
);
