import * as React from "react";
import {
  Wrench,
  Pill,
  Wheat,
  Plus,
  ShoppingCart,
  Pencil,
  Trash2,
  X,
} from "lucide-react";

import { PhoneFrame, ScreenHeader, Card } from "@/components/app/Shell";
import { PieChart } from "@/components/app/Charts";
import {
  useCalves,
  totalCost,
  formatBRL,
  type CostCategory,
} from "@/lib/calves-store";
import { useNavigate } from "@/lib/router";

const catColors: Record<CostCategory, string> = {
  Alimentação: "#3b82f6",
  Manejo: "#8b5cf6",
  Medicamentos: "#ef4444",
  Outros: "#f59e0b",
};

const catIcons: Record<CostCategory, React.ReactNode> = {
  Manejo: <Wrench className="h-5 w-5 text-orange-500" />,
  Medicamentos: <Pill className="h-5 w-5 text-red-500" />,
  Alimentação: <Wheat className="h-5 w-5 text-green-600" />,
  Outros: <Plus className="h-5 w-5 text-gray-500" />,
};

const catTextColor: Record<CostCategory, string> = {
  Manejo: "text-orange-600",
  Medicamentos: "text-red-600",
  Alimentação: "text-green-700",
  Outros: "text-gray-700",
};

export function CalfDetailPage({ id }: { id: string }) {
  const navigate = useNavigate();
  const { getCalf, addCost, listForSale, updateCalf, removeCalf } = useCalves();
  const calf = getCalf(id);

  const [showAdd, setShowAdd] = React.useState(false);
  const [showSale, setShowSale] = React.useState(false);
  const [showEdit, setShowEdit] = React.useState(false);

  if (!calf) {
    return (
      <PhoneFrame>
        <ScreenHeader title="Não encontrado" backTo="/relatorios" />
        <div className="p-6 text-center text-sm text-gray-600">
          Bezerro {id} não está mais disponível.
        </div>
      </PhoneFrame>
    );
  }

  const grouped = new Map<CostCategory, number>();
  calf.costs.forEach((c) => grouped.set(c.category, (grouped.get(c.category) ?? 0) + c.amount));
  const slices = Array.from(grouped.entries()).map(([label, value]) => ({
    label,
    value,
    color: catColors[label],
  }));

  const handleDelete = () => {
    if (confirm(`Excluir ${calf.id}? Esta ação não pode ser desfeita.`)) {
      removeCalf(calf.id);
      navigate({ to: "/relatorios" });
    }
  };

  return (
    <PhoneFrame>
      <ScreenHeader
        title={`#${calf.id}`}
        subtitle={calf.name}
        backTo="/relatorios"
        right={
          <span
            className={`rounded-md px-2 py-1 text-xs font-medium ${
              calf.status === "À venda"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {calf.status}
          </span>
        }
      />
      <div className="space-y-4 p-4">
        <Card>
          {slices.length ? (
            <PieChart slices={slices} />
          ) : (
            <p className="py-8 text-center text-sm text-gray-500">Sem custos cadastrados.</p>
          )}
          <p className="mt-2 text-center text-sm font-semibold text-gray-900">
            Total: {formatBRL(totalCost(calf))}
          </p>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Histórico de Custos ({calf.costs.length})</h2>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700"
            >
              <Plus className="h-3.5 w-3.5" /> Adicionar
            </button>
          </div>
          <div className="space-y-3">
            {calf.costs.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <div className="mt-0.5">{catIcons[c.category]}</div>
                <div className="flex-1">
                  <p className={`font-semibold ${catTextColor[c.category]}`}>{c.category}</p>
                  <p className="text-sm text-gray-700">{c.description}</p>
                  <p className="text-xs text-gray-500">{c.date}</p>
                </div>
                <p className="font-bold text-gray-900">{formatBRL(c.amount)}</p>
              </div>
            ))}
          </div>
        </Card>

        <button
          onClick={() => setShowSale(true)}
          disabled={calf.status === "À venda"}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold text-white shadow-sm hover:bg-green-700 disabled:opacity-60"
        >
          <ShoppingCart className="h-5 w-5" />
          {calf.status === "À venda" ? "Já está à venda" : "Colocar à Venda"}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-800 hover:bg-gray-50"
          >
            <Pencil className="h-4 w-4" /> Editar
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white py-3 font-semibold text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" /> Excluir
          </button>
        </div>
      </div>

      {showAdd && (
        <AddCostModal
          onClose={() => setShowAdd(false)}
          onSave={(c) => {
            addCost(calf.id, c);
            setShowAdd(false);
          }}
        />
      )}

      {showSale && (
        <SaleModal
          onClose={() => setShowSale(false)}
          onConfirm={(price, weight, age, type) => {
            listForSale(calf.id, price, weight, age, type);
            setShowSale(false);
            navigate({ to: "/marketplace" });
          }}
        />
      )}

      {showEdit && (
        <EditModal
          name={calf.name}
          breed={calf.breed}
          onClose={() => setShowEdit(false)}
          onSave={(name, breed) => {
            updateCalf(calf.id, { name, breed });
            setShowEdit(false);
          }}
        />
      )}
    </PhoneFrame>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-green-500";
const labelCls = "mb-1 block text-xs font-semibold text-gray-700";

function AddCostModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (c: {
    category: CostCategory;
    description: string;
    date: string;
    amount: number;
  }) => void;
}) {
  const [category, setCategory] = React.useState<CostCategory>("Alimentação");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");

  return (
    <Modal title="Adicionar Custo" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Categoria</label>
          <select
            className={inputCls}
            value={category}
            onChange={(e) => setCategory(e.target.value as CostCategory)}
          >
            <option>Alimentação</option>
            <option>Manejo</option>
            <option>Medicamentos</option>
            <option>Outros</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Descrição</label>
          <input
            className={inputCls}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Ração premium"
          />
        </div>
        <div>
          <label className={labelCls}>Valor (R$)</label>
          <input
            className={inputCls}
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button
          onClick={() => {
            const v = parseFloat(amount);
            if (!description || !v) return;
            const d = new Date();
            const date = `${String(d.getDate()).padStart(2, "0")} de ${
              [
                "janeiro",
                "fevereiro",
                "março",
                "abril",
                "maio",
                "junho",
                "julho",
                "agosto",
                "setembro",
                "outubro",
                "novembro",
                "dezembro",
              ][d.getMonth()]
            }`;
            onSave({ category, description, date, amount: v });
          }}
          className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700"
        >
          Salvar
        </button>
      </div>
    </Modal>
  );
}

function SaleModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (price: number, weight: number, age: number, type: string) => void;
}) {
  const [price, setPrice] = React.useState("1500");
  const [weight, setWeight] = React.useState("38");
  const [age, setAge] = React.useState("2");
  const [type, setType] = React.useState("Misto");

  return (
    <Modal title="Colocar à Venda" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Preço (R$)</label>
          <input
            className={inputCls}
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Peso (kg)</label>
            <input
              className={inputCls}
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>Idade (meses)</label>
            <input
              className={inputCls}
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className={labelCls}>Tipo</label>
          <input className={inputCls} value={type} onChange={(e) => setType(e.target.value)} />
        </div>
        <button
          onClick={() =>
            onConfirm(parseFloat(price) || 0, parseFloat(weight) || 0, parseFloat(age) || 0, type)
          }
          className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700"
        >
          Confirmar
        </button>
      </div>
    </Modal>
  );
}

function EditModal({
  name,
  breed,
  onClose,
  onSave,
}: {
  name: string;
  breed: string;
  onClose: () => void;
  onSave: (name: string, breed: string) => void;
}) {
  const [n, setN] = React.useState(name);
  const [b, setB] = React.useState(breed);

  return (
    <Modal title="Editar Bezerro" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className={labelCls}>Nome</label>
          <input className={inputCls} value={n} onChange={(e) => setN(e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Raça</label>
          <input className={inputCls} value={b} onChange={(e) => setB(e.target.value)} />
        </div>
        <button
          onClick={() => onSave(n, b)}
          className="w-full rounded-lg bg-green-600 py-2.5 font-semibold text-white hover:bg-green-700"
        >
          Salvar
        </button>
      </div>
    </Modal>
  );
}
