import { ReactNode } from "react";

export const metadata = {
  title: "AgriConnect — Distributor Dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">AgriConnect</h1>
        {/* <p className="text-sm text-gray-500">Distributor Dashboard</p> */}
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
