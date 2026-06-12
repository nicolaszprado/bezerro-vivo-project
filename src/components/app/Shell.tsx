import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  backTo?: string;
  right?: React.ReactNode;
}

export function ScreenHeader({ title, subtitle, backTo = "/", right }: Props) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-200 bg-white px-4 py-4">
      <Link to={backTo} className="mt-1 text-gray-700 hover:text-gray-900">
        <ArrowLeft className="h-5 w-5" />
      </Link>
      <div className="flex-1">
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        {subtitle ? <p className="text-xs text-gray-500">{subtitle}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 sm:bg-gray-200 sm:py-6">
      <div className="mx-auto min-h-screen w-full max-w-md bg-[#f3f4f6] sm:min-h-0 sm:overflow-hidden sm:rounded-2xl sm:shadow-xl">
        {children}
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
