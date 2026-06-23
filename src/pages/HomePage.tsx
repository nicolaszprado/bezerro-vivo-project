import { Beef, TrendingUp, Wallet, CircleDollarSign, Sparkles } from "lucide-react";

import { formatBRL, totalCost, useCalves } from "@/lib/calves-store";
import { PhoneFrame } from "@/components/app/Shell";
import { Link } from "@/lib/router";

export function HomePage() {
  const { calves } = useCalves();
  const forSale = calves.filter((calf) => calf.status === "À venda");
  const totalInventoryCost = calves.reduce((sum, calf) => sum + totalCost(calf), 0);
  const projectedRevenue = forSale.reduce((sum, calf) => sum + (calf.salePrice ?? 0), 0);
  const avgCost = calves.length ? totalInventoryCost / calves.length : 0;
  const featuredCalf = [...forSale].sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0))[0];
  const recentCosts = calves
    .flatMap((calf) => calf.costs.map((cost) => ({ calf, cost })))
    .slice()
    .sort((a, b) => b.cost.id.localeCompare(a.cost.id))
    .slice(0, 3);

  return (
    <PhoneFrame>
      <div className="bg-white">
        <div className="bg-gradient-to-br from-green-600 to-green-700 px-6 py-10 text-white">
          <Beef className="mb-3 h-10 w-10" />
          <h1 className="text-2xl font-bold">Gestão de Bezerros</h1>
          <p className="mt-1 text-sm text-green-50">Controle, custos e marketplace</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            <HeroMetric label="Plantel" value={`${calves.length}`} />
            <HeroMetric label="À venda" value={`${forSale.length}`} />
            <HeroMetric label="Ticket" value={formatBRL(projectedRevenue / (forSale.length || 1))} />
          </div>
        </div>
        <div className="space-y-3 p-6">
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={<Wallet className="h-4 w-4" />}
              label="Custo acumulado"
              value={formatBRL(totalInventoryCost)}
              accent="bg-emerald-50 text-emerald-700"
            />
            <StatCard
              icon={<CircleDollarSign className="h-4 w-4" />}
              label="Potencial de venda"
              value={formatBRL(projectedRevenue)}
              accent="bg-blue-50 text-blue-700"
            />
          </div>

          <div className="rounded-2xl border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
            <div className="mb-1 flex items-center gap-2 text-green-700">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Destaque</span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {featuredCalf ? `${featuredCalf.name} pronto para negociação` : "Plantel em evolução"}
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {featuredCalf
                ? `${featuredCalf.breed} • ${featuredCalf.weightKg}kg • ${featuredCalf.ageMonths} meses`
                : "Os bezerros cadastrados estão em fase de acompanhamento."}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Preço sugerido</p>
                <p className="text-xl font-bold text-green-700">
                  {formatBRL(featuredCalf?.salePrice ?? 0)}
                </p>
              </div>
              {featuredCalf ? (
                <Link
                  to="/bezerros/:id"
                  params={{ id: featuredCalf.id }}
                  className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Ver detalhe
                </Link>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h2 className="font-semibold text-gray-900">Últimas movimentações</h2>
            </div>
            <div className="space-y-3">
              {recentCosts.map(({ calf, cost }) => (
                <div
                  key={cost.id}
                  className="flex items-start justify-between rounded-xl bg-gray-50 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {calf.name} <span className="text-gray-400">#{calf.id}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {cost.category} • {cost.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatBRL(cost.amount)}</p>
                    <p className="text-[11px] text-gray-500">{cost.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white shadow-sm">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-300">
              Resumo executivo
            </p>
            <p className="mt-2 text-lg font-bold">
              Custo médio de {formatBRL(avgCost)} por animal no ciclo atual
            </p>
            <p className="mt-1 text-sm text-slate-300">
              Use a barra inferior para navegar entre indicadores financeiros e oportunidades de venda.
            </p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/12 px-3 py-2 backdrop-blur-sm">
      <p className="text-[11px] uppercase tracking-wide text-green-50/80">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 inline-flex rounded-lg p-2 ${accent}`}>{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}
