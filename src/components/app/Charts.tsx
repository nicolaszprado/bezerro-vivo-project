import { formatBRL } from "@/lib/calves-store";

interface Bar {
  label: string;
  value: number;
}

export function BarChart({ bars, color = "#16a34a" }: { bars: Bar[]; color?: string }) {
  const max = Math.max(...bars.map((b) => b.value), 1);
  const w = 320;
  const h = 180;
  const padding = { l: 36, r: 8, t: 10, b: 28 };
  const innerW = w - padding.l - padding.r;
  const innerH = h - padding.t - padding.b;
  const bw = innerW / bars.length;
  const ticks = 3;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {Array.from({ length: ticks + 1 }).map((_, i) => {
        const y = padding.t + (innerH / ticks) * i;
        const val = Math.round((max / ticks) * (ticks - i));
        return (
          <g key={i}>
            <line x1={padding.l} x2={w - padding.r} y1={y} y2={y} stroke="#e5e7eb" />
            <text x={padding.l - 4} y={y + 3} textAnchor="end" fontSize="9" fill="#6b7280">
              {val}
            </text>
          </g>
        );
      })}
      {bars.map((b, i) => {
        const bh = (b.value / max) * innerH;
        const x = padding.l + i * bw + bw * 0.2;
        const y = padding.t + innerH - bh;
        return (
          <g key={b.label}>
            <rect x={x} y={y} width={bw * 0.6} height={bh} fill={color} rx="2" />
            <text
              x={padding.l + i * bw + bw / 2}
              y={h - 12}
              textAnchor="middle"
              fontSize="10"
              fill="#374151"
            >
              {b.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

interface Slice {
  label: string;
  value: number;
  color: string;
}

export function PieChart({ slices }: { slices: Slice[] }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const cx = 110;
  const cy = 110;
  const r = 80;
  let angle = -Math.PI / 2;
  const paths = slices.map((s) => {
    const a = (s.value / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(angle + a);
    const y2 = cy + r * Math.sin(angle + a);
    const large = a > Math.PI ? 1 : 0;
    const mid = angle + a / 2;
    const lx = cx + (r + 18) * Math.cos(mid);
    const ly = cy + (r + 18) * Math.sin(mid);
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
    const pct = Math.round((s.value / total) * 100);
    angle += a;
    return { d, color: s.color, label: s.label, pct, lx, ly };
  });
  return (
    <svg viewBox="0 0 280 230" className="w-full">
      {paths.map((p) => (
        <path key={p.label} d={p.d} fill={p.color} />
      ))}
      {paths.map((p) => (
        <text
          key={p.label + "t"}
          x={p.lx}
          y={p.ly}
          fontSize="10"
          fill={p.color}
          textAnchor={p.lx > 140 ? "start" : "end"}
        >
          {p.label}: {p.pct}%
        </text>
      ))}
      <title>{slices.map((s) => `${s.label}: ${formatBRL(s.value)}`).join(", ")}</title>
    </svg>
  );
}
