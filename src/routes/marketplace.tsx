import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Scale, CalendarDays, Sprout, Lightbulb } from "lucide-react";
import { PhoneFrame, ScreenHeader, Card } from "@/components/app/Shell";
import { useCalves, formatBRL, type Calf } from "@/lib/calves-store";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [{ title: "Marketplace — Bezerros à venda" }],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const { calves } = useCalves();
  const [q, setQ] = React.useState("");
  const [priceFilter, setPriceFilter] = React.useState("all");
  const [ageFilter, setAgeFilter] = React.useState("all");

  const forSale = calves.filter((c) => c.status === "À venda");
  const filtered = forSale.filter((c) => {
    const matches =
      !q ||
      c.id.toLowerCase().includes(q.toLowerCase()) ||
      c.breed.toLowerCase().includes(q.toLowerCase());
    const price = c.salePrice ?? 0;
    const priceOk =
      priceFilter === "all" ||
      (priceFilter === "low" && price < 1000) ||
      (priceFilter === "mid" && price >= 1000 && price < 2000) ||
      (priceFilter === "high" && price >= 2000);
    const age = c.ageMonths ?? 0;
    const ageOk =
      ageFilter === "all" ||
      (ageFilter === "young" && age <= 3) ||
      (ageFilter === "mid" && age > 3 && age <= 8) ||
      (ageFilter === "old" && age > 8);
    return matches && priceOk && ageOk;
  });

  return (
    <PhoneFrame>
      <ScreenHeader
        title="Marketplace"
        subtitle={`${filtered.length} bezerro${filtered.length === 1 ? "" : "s"} disponíve${filtered.length === 1 ? "l" : "is"}`}
        backTo="/"
      />
      <div className="space-y-4 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por ID ou raça..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-green-500"
          />
        </div>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-700" />
            <h3 className="font-bold text-gray-900">Filtros</h3>
          </div>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Preço</label>
          <select
            className="mb-3 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">Todos os preços</option>
            <option value="low">Até R$ 1.000</option>
            <option value="mid">R$ 1.000 – R$ 2.000</option>
            <option value="high">Acima de R$ 2.000</option>
          </select>
          <label className="mb-1 block text-xs font-semibold text-gray-700">Idade (meses)</label>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
          >
            <option value="all">Todas as idades</option>
            <option value="young">Até 3 meses</option>
            <option value="mid">4 – 8 meses</option>
            <option value="old">Mais de 8 meses</option>
          </select>
        </Card>

        {filtered.length === 0 && (
          <Card>
            <p className="py-6 text-center text-sm text-gray-500">Nenhum bezerro encontrado.</p>
          </Card>
        )}

        {filtered.map((c) => (
          <CalfSaleCard key={c.id} calf={c} />
        ))}

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-gray-800">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <p>
              <span className="font-semibold text-blue-700">Marketplace:</span> Aqui você encontra
              bezerros de outros produtores que estão à venda. Entre em contato para negociar!
            </p>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function CalfSaleCard({ calf }: { calf: Calf }) {
  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100 text-3xl">
          🐂
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-gray-900">#{calf.id}</p>
              <p className="text-sm text-gray-600">{calf.breed}</p>
            </div>
            <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              À venda
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-700">
            {calf.weightKg != null && (
              <span className="flex items-center gap-1">
                <Scale className="h-3 w-3" />
                {calf.weightKg}kg
              </span>
            )}
            {calf.ageMonths != null && (
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3 w-3" />
                {calf.ageMonths} meses
              </span>
            )}
            {calf.type && (
              <span className="flex items-center gap-1">
                <Sprout className="h-3 w-3" />
                {calf.type}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-lg bg-green-50 px-3 py-2">
        <span className="text-sm text-gray-700">Preço</span>
        <span className="text-lg font-bold text-green-700">
          {formatBRL(calf.salePrice ?? 0)}
        </span>
      </div>

      <button
        onClick={() => alert("Contato do produtor exibido com sucesso.")}
        className="mt-3 w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700"
      >
        Entrar em contato
      </button>
    </Card>
  );
}
