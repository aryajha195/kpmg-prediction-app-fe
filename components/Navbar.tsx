"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calculator,
  BarChart3,
  History,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Property Estimator",
    href: "/estimator",
    icon: Calculator,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-lg shadow-blue-600/20">
            H
          </div>

          <div>
            <p className="font-bold text-slate-900">
              HousingAI
            </p>

            <p className="hidden text-xs text-slate-500 sm:block">
              Property Intelligence
            </p>
          </div>
        </Link>

        {/* NAVIGATION */}

        <nav className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => {
            const Icon = item.icon;

            /*
             * Dashboard should only be active
             * when pathname is exactly "/".
             *
             * For other pages, we also support
             * nested routes.
             */

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    item.href
                  );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={17} />

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* API STATUS */}

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-xs font-medium text-slate-600">
            ML API
          </span>
        </div>

      </div>
    </header>
  );
}