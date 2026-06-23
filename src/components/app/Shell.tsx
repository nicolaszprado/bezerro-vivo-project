import * as React from "react";
import { ArrowLeft, BarChart3, Beef, Store } from "lucide-react";

import { usePathname } from "@/lib/router";
import { Link } from "@/lib/router";

interface Props {
  title: string;
  subtitle?: string;
  backTo?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, backTo, right }: Props) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-200 bg-white px-4 py-4">
      {backTo ? (
        <Link to={backTo} className="mt-1 text-gray-700 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
      ) : null}
      <div className="flex-1">
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showBottomNav =
    pathname === "/" || pathname === "/relatorios" || pathname === "/marketplace";

  return (
    <div className="min-h-screen bg-gray-100 sm:bg-gray-200 sm:py-6">
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#f3f4f6] sm:min-h-0 sm:overflow-hidden sm:rounded-2xl sm:shadow-xl">
        <div className={`min-h-screen ${showBottomNav ? "pb-24" : ""} sm:min-h-0`}>
          {children}
        </div>
        {showBottomNav ? <BottomNav pathname={pathname} /> : null}
      </div>
    </div>
  );
}

function BottomNav({ pathname }: { pathname: string }) {
  const items = [
    { to: "/", label: "Início", icon: Beef },
    { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
    { to: "/marketplace", label: "Marketplace", icon: Store },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 px-4 pb-4">
      <div className="grid grid-cols-3 rounded-3xl border border-gray-200 bg-white/95 p-2 shadow-[0_10px_35px_rgba(15,23,42,0.16)] backdrop-blur">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-xs font-medium transition ${
                active
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}


export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
