import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Store, Beef } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gestão de Bezerros" },
      { name: "description", content: "App de gestão agropecuária de bezerros" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-gray-100 sm:bg-gray-200 sm:py-6">
      <div className="mx-auto min-h-screen w-full max-w-md bg-white sm:min-h-0 sm:overflow-hidden sm:rounded-2xl sm:shadow-xl">

        <div className="bg-gradient-to-br from-green-600 to-green-700 px-6 py-10 text-white">
          <Beef className="mb-3 h-10 w-10" />
          <h1 className="text-2xl font-bold">Gestão de Bezerros</h1>
          <p className="mt-1 text-sm text-green-50">Controle, custos e marketplace</p>
        </div>
        <div className="space-y-3 p-6">
          <NavCard to="/relatorios" icon={<BarChart3 className="h-5 w-5" />} title="Relatórios" subtitle="Análise de custos e desempenho" />
          <NavCard to="/marketplace" icon={<Store className="h-5 w-5" />} title="Marketplace" subtitle="Bezerros à venda" />
        </div>
      </div>
    </div>
  );
}

function NavCard({ to, icon, title, subtitle }: { to: string; icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <Link to={to} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-green-500 hover:shadow-md">
      <div className="rounded-lg bg-green-100 p-3 text-green-700">{icon}</div>
      <div>
        <p className="font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </Link>
  );
}
