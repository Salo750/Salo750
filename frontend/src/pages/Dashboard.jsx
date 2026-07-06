import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Search, RefreshCw, Inbox, Download, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { listLeads, getStats } from "@/lib/api";
import { STATUSES, shortId, timeAgo } from "@/lib/format";
import { leadsToCsv, downloadCsv } from "@/lib/csv";

const STATUS_RANK = { new: 0, contacted: 1, booked: 2, lost: 3 };

const SORT_ACCESSORS = {
  id: (l) => l.id,
  business_name: (l) => l.business_name.toLowerCase(),
  customer_name: (l) => l.customer_name.toLowerCase(),
  customer_phone: (l) => l.customer_phone,
  service_category: (l) => l.service_category.toLowerCase(),
  customer_message: (l) => l.customer_message.toLowerCase(),
  status: (l) => STATUS_RANK[l.status] ?? 99,
  received_time: (l) => new Date(l.received_time).getTime(),
};

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, booked: 0, lost: 0 });
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState({ key: "received_time", dir: "desc" });

  const toggleSort = (key) => {
    setSort((cur) =>
      cur.key === key
        ? { key, dir: cur.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "received_time" ? "desc" : "asc" }
    );
  };

  const load = async () => {
    setLoading(true);
    try {
      const [ls, st] = await Promise.all([listLeads(), getStats()]);
      setLeads(ls);
      setStats(st);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = leads.filter((l) => {
      if (statusFilter !== "all" && l.status !== statusFilter) return false;
      if (!q) return true;
      return (
        l.customer_name.toLowerCase().includes(q) ||
        l.business_name.toLowerCase().includes(q) ||
        l.customer_phone.toLowerCase().includes(q) ||
        l.service_category.toLowerCase().includes(q) ||
        l.customer_message.toLowerCase().includes(q)
      );
    });
    const accessor = SORT_ACCESSORS[sort.key] || SORT_ACCESSORS.received_time;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
  }, [leads, query, statusFilter, sort]);

  const exportCsv = () => {
    if (filtered.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    const csv = leadsToCsv(filtered);
    const stamp = new Date().toISOString().slice(0, 19).replaceAll(":", "-");
    downloadCsv(`localops-leads-${stamp}.csv`, csv);
    toast.success(`Exported ${filtered.length} lead${filtered.length === 1 ? "" : "s"}`);
  };

  return (
    <div className="fade-up max-w-7xl mx-auto px-6 py-10" data-testid="dashboard-page">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div>
          <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-3">
            /// Pipeline
          </p>
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-zinc-50">
            Lead Dashboard
          </h1>
          <p className="mt-2 text-zinc-400">
            Every open, contacted, and closed lead — in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={exportCsv}
            data-testid="dashboard-export-csv-btn"
            className="bg-transparent border-zinc-800 hover:bg-zinc-900 text-zinc-200 rounded-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={load}
            data-testid="dashboard-refresh-btn"
            className="bg-transparent border-zinc-800 hover:bg-zinc-900 text-zinc-200 rounded-sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            asChild
            data-testid="dashboard-new-lead-btn"
            className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold uppercase tracking-wider rounded-sm"
          >
            <Link to="/capture">
              <PlusCircle className="w-4 h-4 mr-2" />
              New Lead
            </Link>
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <StatCard label="Total" value={stats.total} testid="stat-total" accent="text-zinc-50" />
        <StatCard label="New" value={stats.new} testid="stat-new" accent="text-cyan-400" />
        <StatCard label="Contacted" value={stats.contacted} testid="stat-contacted" accent="text-yellow-300" />
        <StatCard label="Booked" value={stats.booked} testid="stat-booked" accent="text-green-400" />
        <StatCard label="Lost" value={stats.lost} testid="stat-lost" accent="text-red-400" />
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            data-testid="dashboard-search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, service, message…"
            className="pl-10 bg-zinc-950 border-zinc-800 rounded-sm text-zinc-100 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            data-testid="dashboard-status-filter"
            className="w-full sm:w-56 bg-zinc-950 border-zinc-800 rounded-sm text-zinc-100"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-950 border-zinc-800">
            <SelectItem value="all" className="text-zinc-100 focus:bg-zinc-800">
              All statuses
            </SelectItem>
            {STATUSES.map((s) => (
              <SelectItem
                key={s}
                value={s}
                className="text-zinc-100 focus:bg-zinc-800 capitalize"
                data-testid={`filter-status-${s}`}
              >
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* TABLE (desktop) / CARDS (mobile) */}
      {loading ? (
        <SkeletonList />
      ) : filtered.length === 0 ? (
        <EmptyState hasLeads={leads.length > 0} />
      ) : (
        <>
          <div
            className="hidden md:block border border-zinc-800 rounded-sm overflow-hidden bg-zinc-900/40"
            data-testid="leads-table"
          >
            <table className="w-full text-sm">
              <thead className="bg-zinc-900 border-b border-zinc-800">
                <tr className="text-xs uppercase tracking-widest text-zinc-500">
                  <SortableTh sort={sort} k="id" onClick={toggleSort}>Lead ID</SortableTh>
                  <SortableTh sort={sort} k="business_name" onClick={toggleSort}>Business</SortableTh>
                  <SortableTh sort={sort} k="customer_name" onClick={toggleSort}>Customer</SortableTh>
                  <SortableTh sort={sort} k="customer_phone" onClick={toggleSort}>Phone</SortableTh>
                  <SortableTh sort={sort} k="service_category" onClick={toggleSort}>Service</SortableTh>
                  <SortableTh sort={sort} k="customer_message" onClick={toggleSort}>Message</SortableTh>
                  <SortableTh sort={sort} k="status" onClick={toggleSort}>Status</SortableTh>
                  <SortableTh sort={sort} k="received_time" onClick={toggleSort}>Received</SortableTh>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    data-testid={`lead-row-${l.id}`}
                    className="border-b border-zinc-800 last:border-b-0 hover:bg-zinc-900 transition-colors cursor-pointer"
                    onClick={() => (window.location.href = `/leads/${l.id}`)}
                  >
                    <Td>
                      <Link
                        to={`/leads/${l.id}`}
                        data-testid={`lead-link-${l.id}`}
                        className="font-mono text-orange-500 hover:text-orange-400"
                        onClick={(e) => e.stopPropagation()}
                      >
                        #{shortId(l.id)}
                      </Link>
                    </Td>
                    <Td className="text-zinc-300">{l.business_name}</Td>
                    <Td className="text-zinc-100 font-medium">{l.customer_name}</Td>
                    <Td className="text-zinc-400 font-mono text-xs">{l.customer_phone}</Td>
                    <Td className="text-zinc-300">{l.service_category}</Td>
                    <Td className="text-zinc-400 max-w-xs truncate">{l.customer_message}</Td>
                    <Td>
                      <StatusBadge status={l.status} testid={`row-status-${l.id}`} />
                    </Td>
                    <Td className="text-zinc-500 text-xs whitespace-nowrap">
                      {timeAgo(l.received_time)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3" data-testid="leads-cards">
            {filtered.map((l) => (
              <Link
                key={l.id}
                to={`/leads/${l.id}`}
                data-testid={`lead-card-${l.id}`}
                className="block border border-zinc-800 bg-zinc-900/40 rounded-sm p-4 hover:border-orange-500/60 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-orange-500">#{shortId(l.id)}</span>
                  <StatusBadge status={l.status} />
                </div>
                <div className="font-bold text-zinc-100 text-lg">{l.customer_name}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                  {l.business_name}
                </div>
                <div className="text-sm text-zinc-400 line-clamp-2 mb-3">{l.customer_message}</div>
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>{l.service_category}</span>
                  <span>{timeAgo(l.received_time)}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const StatCard = ({ label, value, accent, testid }) => (
  <div
    data-testid={testid}
    className="border border-zinc-800 bg-zinc-900/40 rounded-sm p-5 hover:border-zinc-700 transition-colors"
  >
    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
      {label}
    </div>
    <div className={`font-display font-black text-4xl mt-1 tracking-tight ${accent}`}>
      {value}
    </div>
  </div>
);

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left font-semibold">{children}</th>
);

const SortableTh = ({ children, k, sort, onClick }) => {
  const active = sort.key === k;
  const Icon = !active ? ArrowUpDown : sort.dir === "asc" ? ArrowUp : ArrowDown;
  return (
    <th className="px-4 py-3 text-left font-semibold">
      <button
        type="button"
        onClick={() => onClick(k)}
        data-testid={`sort-${k}`}
        className={`flex items-center gap-1.5 uppercase tracking-widest text-xs transition-colors ${
          active ? "text-orange-500" : "text-zinc-500 hover:text-zinc-200"
        }`}
      >
        {children}
        <Icon className="w-3 h-3" />
      </button>
    </th>
  );
};
const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-4 ${className}`}>{children}</td>
);

const SkeletonList = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-16 border border-zinc-800 bg-zinc-900/40 rounded-sm animate-pulse" />
    ))}
  </div>
);

const EmptyState = ({ hasLeads }) => (
  <div
    data-testid="dashboard-empty"
    className="border border-dashed border-zinc-800 rounded-sm p-16 text-center"
  >
    <div className="grid place-items-center w-14 h-14 mx-auto bg-zinc-900 border border-zinc-800 rounded-sm mb-4">
      <Inbox className="w-6 h-6 text-zinc-500" />
    </div>
    <h3 className="font-display font-bold text-xl uppercase text-zinc-100 tracking-tight">
      {hasLeads ? "No matches" : "No leads yet"}
    </h3>
    <p className="text-zinc-500 mt-2">
      {hasLeads ? "Try clearing your filters." : "Capture your first missed lead to get started."}
    </p>
    {!hasLeads && (
      <Button
        asChild
        data-testid="empty-new-lead-btn"
        className="mt-6 bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold uppercase tracking-wider rounded-sm"
      >
        <Link to="/capture">
          <PlusCircle className="w-4 h-4 mr-2" /> Capture Lead
        </Link>
      </Button>
    )}
  </div>
);
