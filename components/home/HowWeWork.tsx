const steps = [
  {
    name: "Explore",
    body: "We map the problem from every side at once — the data, the users, the constraints — before committing to a route.",
    // many tendrils fanning out
    svg: (
      <g>
        <path d="M60 70 C40 50 30 40 14 30M60 70 C60 45 62 30 60 12M60 70 C80 50 92 40 106 30M60 70 C40 80 26 92 12 98M60 70 C80 82 94 92 108 98" />
        <circle fill="currentColor" cx="60" cy="70" r="6" />
      </g>
    ),
  },
  {
    name: "Prune",
    body: "Dead ends get cut early. Prototypes, evals and small tests tell us which paths are worth feeding.",
    svg: (
      <g>
        <path d="M60 70 C60 45 62 30 60 12M60 70 C80 50 92 40 106 30" />
        <path d="M60 70 C40 50 30 40 14 30M60 70 C40 80 26 92 12 98M60 70 C80 82 94 92 108 98" strokeDasharray="3 6" opacity="0.35" />
        <circle fill="currentColor" cx="60" cy="70" r="6" />
      </g>
    ),
  },
  {
    name: "Converge",
    body: "The strongest route thickens into the product: shipped, measured, and handed over in a state your team can run.",
    svg: (
      <g>
        <path d="M60 104 C60 80 62 40 60 12" strokeWidth="6" />
        <circle fill="currentColor" cx="60" cy="12" r="7" />
        <circle fill="currentColor" cx="60" cy="104" r="5" />
      </g>
    ),
  },
];

export function HowWeWork() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {steps.map((s, i) => (
        <div key={s.name} className="rounded-2xl border border-line p-6">
          <svg viewBox="0 0 120 116" className="h-28 w-auto text-mold" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <g fill="none">{s.svg}</g>
          </svg>
          <p className="mt-6 font-mono text-xs text-muted">0{i + 1}</p>
          <h3 className="mt-1 text-2xl font-semibold tracking-tight">{s.name}</h3>
          <p className="mt-3 text-muted">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
