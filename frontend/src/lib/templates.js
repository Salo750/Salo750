// Template-based follow-up message generator (no AI).
// Placeholders: {customer_name}, {business_name}, {service_category}

export const TEMPLATES = [
  {
    id: "standard",
    label: "Standard Follow-up",
    body: `Hi {customer_name}, this is {business_name}. Sorry we missed your call about your {service_category} job. We'd love to help — what's the best time today or tomorrow for a quick call to go over the details?`,
  },
  {
    id: "busy_callback",
    label: "Busy — Call Later",
    body: `Hi {customer_name}, {business_name} here. We just wrapped up another {service_category} job and saw your message. Can we call you back in the next hour, or would later this evening work better?`,
  },
  {
    id: "quote_ready",
    label: "Ready to Quote",
    body: `Hi {customer_name}, thanks for reaching out to {business_name}. Based on what you shared about your {service_category} project, we can get you a free written estimate within 24 hours. Want to book a quick 10-minute site visit?`,
  },
  {
    id: "same_day",
    label: "Same-Day Availability",
    body: `Hi {customer_name}, {business_name} here — we've had a slot open up today for {service_category}. If you still need help, reply YES and we'll roll a truck out this afternoon.`,
  },
];

export function renderTemplate(tpl, lead) {
  if (!tpl || !lead) return "";
  return tpl.body
    .replaceAll("{customer_name}", lead.customer_name || "there")
    .replaceAll("{business_name}", lead.business_name || "our team")
    .replaceAll("{service_category}", (lead.service_category || "your project").toLowerCase());
}
