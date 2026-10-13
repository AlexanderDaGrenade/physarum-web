import { MARK_CENTER, MARK_NODES, MARK_PATH, MARK_VIEWBOX } from "./logo-paths";

/**
 * The logo mark revealed node by node, nearest-to-centre first, the way the
 * organism spreads. Each node's reveal circle overshoots its radius so the
 * tubes between nodes fill in; a final circle completes the shape.
 */
export function GrowingMark({
  className,
  maskId = "mark-grow",
  ...rest
}: { className?: string; maskId?: string } & React.SVGProps<SVGSVGElement>) {
  const [cx, cy] = MARK_CENTER;
  return (
    <svg {...rest} viewBox={MARK_VIEWBOX} className={className} fill="currentColor" aria-hidden="true">
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="86" y="490" width="276" height="268">
          <circle cx={cx} cy={cy} r="28" fill="#fff" className="node-grow" />
          {MARK_NODES.map(([x, y, r], i) => (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r * 2.4}
              fill="#fff"
              className="node-grow"
              style={{ animationDelay: `${0.15 + i * 0.11}s` }}
            />
          ))}
          <circle
            cx={cx}
            cy={cy}
            r="200"
            fill="#fff"
            className="node-grow"
            style={{ animationDelay: `${0.25 + MARK_NODES.length * 0.11}s`, animationDuration: "0.6s" }}
          />
        </mask>
      </defs>
      <path d={MARK_PATH} mask={`url(#${maskId})`} />
    </svg>
  );
}
