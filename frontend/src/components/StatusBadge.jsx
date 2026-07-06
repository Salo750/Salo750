import { STATUS_META } from "@/lib/format";

export const StatusBadge = ({ status, testid }) => {
  const meta = STATUS_META[status] || STATUS_META.new;
  return (
    <span
      data-testid={testid || `status-badge-${status}`}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${meta.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
      {meta.label}
    </span>
  );
};

export default StatusBadge;
