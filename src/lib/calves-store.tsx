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
    name: "Tropeiro",
    breed: "Nelore",
    status: "Em criação",
    costs: [
      { id: "c1", category: "Alimentação", description: "Ração inicial proteica", date: "10 de janeiro", amount: 800 },
      { id: "c2", category: "Manejo", description: "Manejo geral e identificação", date: "20 de janeiro", amount: 450 },
      { id: "c9", category: "Medicamentos", description: "Vacina clostridial", date: "08 de fevereiro", amount: 215 },
      { id: "c10", category: "Outros", description: "Brinco e pesagem", date: "14 de fevereiro", amount: 96 },
    ],
  },
  {
    id: "BZ-002",
    name: "Brasa",
    breed: "Angus",
    status: "Em criação",
    costs: [
      { id: "c3", category: "Manejo", description: "Manejo de pasto", date: "31 de janeiro", amount: 500 },
      { id: "c4", category: "Medicamentos", description: "Vermífugo e vitaminas", date: "14 de janeiro", amount: 400.5 },
      { id: "c5", category: "Alimentação", description: "Suplementação premium", date: "09 de janeiro", amount: 1200 },
      { id: "c11", category: "Alimentação", description: "Silagem complementar", date: "11 de fevereiro", amount: 340 },
    ],
  },
  {
    id: "BZ-003",
    name: "Granizo",
    breed: "Brahman",
    status: "À venda",
    salePrice: 2850,
    weightKg: 96,
    ageMonths: 7,
    type: "Corte",
    costs: [
      { id: "c6", category: "Alimentação", description: "Suplementação energética", date: "05 de janeiro", amount: 600 },
      { id: "c7", category: "Manejo", description: "Manejo sanitário", date: "12 de janeiro", amount: 380 },
      { id: "c12", category: "Outros", description: "Frete para feira regional", date: "18 de fevereiro", amount: 220 },
    ],
  },
  {
    id: "BZ-004",
    name: "Safira",
    breed: "Nelore",
    status: "Em criação",
    costs: [
      { id: "c8", category: "Alimentação", description: "Ração", date: "07 de janeiro", amount: 450 },
      { id: "c13", category: "Medicamentos", description: "Protocolo preventivo", date: "09 de fevereiro", amount: 180 },
      { id: "c14", category: "Manejo", description: "Avaliação de ganho de peso", date: "21 de fevereiro", amount: 260 },
    ],
  },
  {
    id: "BZ-005",
    name: "Imperador",
    breed: "Cruzamento Angus x Nelore",
    status: "À venda",
    salePrice: 3120,
    weightKg: 118,
    ageMonths: 8,
    type: "Corte",
    costs: [
      { id: "c15", category: "Alimentação", description: "Ração de crescimento", date: "13 de janeiro", amount: 980 },
      { id: "c16", category: "Medicamentos", description: "Reforço vacinal", date: "27 de janeiro", amount: 230 },
      { id: "c17", category: "Manejo", description: "Mão de obra e curral", date: "16 de fevereiro", amount: 420 },
    ],
  },
  {
    id: "BZ-006",
    name: "Aurora",
    breed: "Gir Leiteiro",
    status: "Em criação",
    costs: [
      { id: "c18", category: "Alimentação", description: "Suplemento mineral", date: "06 de fevereiro", amount: 290 },
      { id: "c19", category: "Medicamentos", description: "Consulta veterinária", date: "18 de fevereiro", amount: 165 },
      { id: "c20", category: "Outros", description: "Transporte interno", date: "01 de março", amount: 95 },
    ],
  },
  {
    id: "BZ-007",
    name: "Campeiro",
    breed: "Hereford",
    status: "À venda",
    salePrice: 2680,
    weightKg: 102,
    ageMonths: 6,
    type: "Reprodução",
    costs: [
      { id: "c21", category: "Alimentação", description: "Concentrado", date: "17 de janeiro", amount: 720 },
      { id: "c22", category: "Manejo", description: "Apartação e revisão", date: "23 de fevereiro", amount: 310 },
      { id: "c23", category: "Outros", description: "Foto e anúncio", date: "03 de março", amount: 80 },
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
