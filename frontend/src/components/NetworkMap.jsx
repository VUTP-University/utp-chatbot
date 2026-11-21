import { useReducedMotion } from '../hooks/useReducedMotion'

// Decorative network topology: nodes (stations, servers) linked by edges, with data
// "packets" travelling along them — a nod to both telecom networks and postal parcels.
const NODES = [
  { x: 120,  y: 120 },
  { x: 330,  y: 70,  label: '5G' },
  { x: 560,  y: 150 },
  { x: 800,  y: 90,  label: 'CLOUD' },
  { x: 1050, y: 160 },
  { x: 230,  y: 320, label: 'IoT' },
  { x: 470,  y: 370 },
  { x: 700,  y: 300, label: 'AI', hub: true },
  { x: 950,  y: 360, label: 'SEC' },
  { x: 1120, y: 430 },
  { x: 140,  y: 520 },
  { x: 400,  y: 560, label: 'DATA' },
  { x: 660,  y: 520 },
  { x: 900,  y: 580, label: 'MAIL' },
  { x: 1110, y: 600 },
]

const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 5], [5, 6], [6, 7], [7, 8], [8, 9],
  [4, 9], [2, 7], [3, 7], [5, 10], [10, 11], [11, 12], [12, 13], [13, 14], [9, 14],
  [6, 11], [7, 12], [8, 13],
]

// [edge index, reverse direction, duration in s, start delay in s]
const PACKETS = [
  [1, false, 3.2, 0], [6, false, 2.6, 0.8], [7, true, 2.8, 1.6], [11, false, 2.2, 0.4],
  [12, true, 2.4, 2.1], [15, false, 3.0, 1.1], [16, false, 2.7, 2.6], [19, true, 2.5, 0.2],
  [20, false, 2.3, 1.9], [9, true, 3.4, 0.6], [3, false, 3.1, 2.9],
]

export default function NetworkMap({ className = '' }) {
  const reduced = useReducedMotion()

  return (
    <svg className={`netmap ${className}`} viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <g className="netmap-edges">
        {EDGES.map(([a, b], i) => (
          <line key={i} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} />
        ))}
      </g>

      {!reduced && (
        <g className="netmap-packets">
          {PACKETS.map(([edge, reverse, dur, delay], i) => {
            const [a, b] = EDGES[edge]
            const [from, to] = reverse ? [NODES[b], NODES[a]] : [NODES[a], NODES[b]]
            return (
              <rect key={i} x="-3.5" y="-3.5" width="7" height="7" rx="1.5" className={i % 3 === 0 ? 'packet packet--signal' : 'packet'}>
                <animateMotion
                  path={`M${from.x} ${from.y} L${to.x} ${to.y}`}
                  dur={`${dur}s`}
                  begin={`${delay}s`}
                  repeatCount="indefinite"
                />
              </rect>
            )
          })}
        </g>
      )}

      <g className="netmap-nodes">
        {NODES.map((n, i) => (
          <g key={i} transform={`translate(${n.x} ${n.y})`} className={n.hub ? 'node node--hub' : 'node'}>
            <circle r={n.hub ? 22 : 13} className="node-halo" />
            <circle r={n.hub ? 9 : 5} className="node-core" />
            {n.label && <text x={n.hub ? 30 : 20} y="5" className="node-label">{n.label}</text>}
          </g>
        ))}
      </g>
    </svg>
  )
}
