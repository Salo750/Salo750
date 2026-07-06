export function timeAgo(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString();
}

export function shortId(id) {
  if (!id) return "";
  return id.split("-")[0].toUpperCase();
}

export const STATUS_META = {
  new: {
    label: "New",
    className: "bg-cyan-500/10 text-cyan-400 border-cyan-600",
  },
  contacted: {
    label: "Contacted",
    className: "bg-yellow-500/10 text-yellow-300 border-yellow-600",
  },
  booked: {
    label: "Booked",
    className: "bg-green-500/10 text-green-400 border-green-600",
  },
  lost: {
    label: "Lost",
    className: "bg-red-500/10 text-red-400 border-red-600",
  },
};

export const STATUSES = ["new", "contacted", "booked", "lost"];
