// CSV export helper. Escapes quotes/newlines per RFC 4180.
const HEADERS = [
  "lead_id",
  "business_name",
  "customer_name",
  "customer_phone",
  "service_category",
  "lead_source",
  "status",
  "received_time",
  "customer_message",
  "notes_count",
];

function esc(val) {
  if (val === null || val === undefined) return "";
  const s = String(val);
  if (/[",\n\r]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}

export function leadsToCsv(leads) {
  const lines = [HEADERS.join(",")];
  for (const l of leads) {
    lines.push(
      [
        l.id,
        l.business_name,
        l.customer_name,
        l.customer_phone,
        l.service_category,
        l.lead_source,
        l.status,
        l.received_time,
        l.customer_message,
        (l.notes || []).length,
      ]
        .map(esc)
        .join(",")
    );
  }
  return lines.join("\n");
}

export function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
