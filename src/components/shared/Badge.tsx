interface BadgeProps {
  label: string;
  color: string;
}

export default function Badge({ label, color }: BadgeProps) {
  return (
    <span
      className="text-xs px-2 py-1 rounded"
      style={{ backgroundColor: color + "22", color }}
    >
      {label}
    </span>
  );
}
