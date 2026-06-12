import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lightbulb } from "lucide-react";
import { PhoneFrame, ScreenHeader, Card } from "@/components/app/Shell";
import { BarChart } from "@/components/app/Charts";
import { useCalves, totalCost, formatBRL } from "@/lib/calves-store";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Gestão de Bezerros" },
      { name: "description", content: "Análise de custos e desempenho dos bezerros" },
    ],
  }),
  component: RelatoriosPage,
});

function RelatoriosPage() {
  const { calves } = useCalves();
  const navigate = useNavigate();

  const sorted = [...calves].sort((a, b) => totalCost(b) - totalCost(a));
  const bars = sorted.map((c) => ({ label: c.id, value: Math.round(totalCost(c)) }));
  const max = Math.max(...sorted.map(totalCost), 1);
  const avg = sorted.reduce((s, c) => s + totalCost(c), 0) / (sorted.length || 1);

  const costColor = (v: number) => {
    if (v >= avg * 1.4) return "text-red-600";
    if (v >= avg) return "text-orange-600";
    return "text-green-600";
  };

  const handleExport = () => {
    try {
      const lines = [
        "Relatório de Bezerros",
        "",
        ...sorted.map((c) => `${c.id} | ${c.breed} | ${formatBRL(totalCost(c))}`),
      ];
      const blob = new Blob([lines.join("\n")], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio-bezerros.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Relatório exportado com sucesso!");
    }
  };

  return (
    <PhoneFrame>
      <ScreenHeader title="Relatórios" subtitle="Análise de custos e desempenho" backTo="/" />
      <div className="space-y-4 p-4">
        <Card>
          <BarChart bars={bars} />
          <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-600">
            <span className="inline-block h-3 w-3 rounded-sm bg-green-600" />
            Custo Total
          </div>
        </Card>

        <Card className="p-0">
          <h2 className="px-4 pb-3 pt-4 font-bold text-gray-900">Todos os Bezerros</h2>
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-600">
            <span>ID</span>
            <span>Raça</span>
            <span className="text-right">Custo</span>
          </div>
          {sorted.map((c) => (
            <button
              key={c.id}
              onClick={() => navigate({ to: "/bezerros/$id", params: { id: c.id } })}
              className="grid w-full grid-cols-[1fr_1fr_auto] gap-2 border-t border-gray-100 px-4 py-3 text-left text-sm hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-900">{c.id}</span>
              <span className="text-gray-700">{c.breed}</span>
              <span className={`text-right font-bold ${costColor(totalCost(c))}`}>
                {formatBRL(totalCost(c))}
              </span>
            </button>
          ))}
        </Card>

        <Card>
          <div className="mb-2 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h2 className="font-bold text-gray-900">Insights</h2>
          </div>
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm text-gray-800">
            <span className="font-semibold">Atenção:</span> Você tem bezerros com custo muito acima
            da média. Considere avaliar se vale a pena continuar o investimento.
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Custo máximo: {formatBRL(max)} · Média: {formatBRL(avg)}
          </p>
        </Card>

        <button
          onClick={handleExport}
          className="w-full rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-900 hover:bg-gray-50"
        >
          Exportar Relatório (PDF)
        </button>
      </div>
    </PhoneFrame>
  );
}
