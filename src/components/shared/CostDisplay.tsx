interface CostDisplayProps {
  cost: Record<string, number>;
}

export default function CostDisplay({ cost }: CostDisplayProps) {
  const entries = Object.entries(cost);

  if (entries.length === 0) {
    return (
      <span className="text-lg font-bold text-green-400 px-4 py-2 rounded-lg bg-green-500/20">
        Free
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([item, qty]) => (
        <span
          key={item}
          className="text-sm px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-orange-300 font-bold"
        >
          {qty}x {item}
        </span>
      ))}
    </div>
  );
}
