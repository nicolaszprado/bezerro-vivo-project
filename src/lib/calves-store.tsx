import * as React from "react";

export type CalfStatus = "Em criação" | "À venda";

export type CostCategory = "Manejo" | "Medicamentos" | "Alimentação" | "Outros";

export interface CostEntry {
  id: string;
  category: CostCategory;
  description: string;
  date: string; // formatted PT-BR
  amount: number;
}

export interface Calf {
  id: string;
  name: string;
  breed: string;
  status: CalfStatus;
  costs: CostEntry[];
  salePrice?: number;
  weightKg?: number;
  ageMonths?: number;
  type?: string;
}

const initial: Calf[] = [
  {
    id: "BZ-001",
    name: "Bezerro 001",
    breed: "Nelore",
    status: "Em criação",
    costs: [
      { id: "c1", category: "Alimentação", description: "Ração inicial", date: "10 de janeiro", amount: 800 },
      { id: "c2", category: "Manejo", description: "Manejo geral", date: "20 de janeiro", amount: 450 },
    ],
  },
  {
    id: "BZ-002",
    name: "Bezerro 002",
    breed: "Angus",
    status: "Em criação",
    costs: [
      { id: "c3", category: "Manejo", description: "Manejo de pasto", date: "31 de janeiro", amount: 500 },
      { id: "c4", category: "Medicamentos", description: "Vermífugo e vitaminas", date: "14 de janeiro", amount: 400.5 },
      { id: "c5", category: "Alimentação", description: "Suplementação", date: "09 de janeiro", amount: 1200 },
    ],
  },
  {
    id: "BZ-003",
    name: "Bezerro 003",
    breed: "Brahman",
    status: "À venda",
    salePrice: 1500,
    weightKg: 38,
    ageMonths: 2,
    type: "Misto",
    costs: [
      { id: "c6", category: "Alimentação", description: "Suplementação", date: "05 de janeiro", amount: 600 },
      { id: "c7", category: "Manejo", description: "Manejo", date: "12 de janeiro", amount: 380 },
    ],
  },
  {
    id: "BZ-004",
    name: "Bezerro 004",
    breed: "Nelore",
    status: "Em criação",
    costs: [
      { id: "c8", category: "Alimentação", description: "Ração", date: "07 de janeiro", amount: 450 },
    ],
  },
];

export const totalCost = (c: Calf) => c.costs.reduce((s, x) => s + x.amount, 0);

export const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Ctx {
  calves: Calf[];
  getCalf: (id: string) => Calf | undefined;
  addCost: (calfId: string, cost: Omit<CostEntry, "id">) => void;
  listForSale: (calfId: string, price: number, weightKg: number, ageMonths: number, type: string) => void;
  updateCalf: (calfId: string, patch: Partial<Calf>) => void;
  removeCalf: (calfId: string) => void;
}

const CalvesContext = React.createContext<Ctx | null>(null);

export function CalvesProvider({ children }: { children: React.ReactNode }) {
  const [calves, setCalves] = React.useState<Calf[]>(initial);

  const value: Ctx = {
    calves,
    getCalf: (id) => calves.find((c) => c.id === id),
    addCost: (calfId, cost) =>
      setCalves((prev) =>
        prev.map((c) =>
          c.id === calfId ? { ...c, costs: [{ ...cost, id: crypto.randomUUID() }, ...c.costs] } : c,
        ),
      ),
    listForSale: (calfId, price, weightKg, ageMonths, type) =>
      setCalves((prev) =>
        prev.map((c) =>
          c.id === calfId
            ? { ...c, status: "À venda", salePrice: price, weightKg, ageMonths, type }
            : c,
        ),
      ),
    updateCalf: (calfId, patch) =>
      setCalves((prev) => prev.map((c) => (c.id === calfId ? { ...c, ...patch } : c))),
    removeCalf: (calfId) => setCalves((prev) => prev.filter((c) => c.id !== calfId)),
  };

  return <CalvesContext.Provider value={value}>{children}</CalvesContext.Provider>;
}

export function useCalves() {
  const ctx = React.useContext(CalvesContext);
  if (!ctx) throw new Error("useCalves must be used within CalvesProvider");
  return ctx;
}
