import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createLead } from "@/lib/api";

const SERVICE_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Roofing",
  "HVAC",
  "General Contracting",
  "Landscaping",
  "Painting",
  "Flooring",
  "Other",
];

const LEAD_SOURCES = [
  "Missed Call",
  "Missed Text",
  "Website Form",
  "Google Ads",
  "Referral",
  "Yelp",
  "Facebook",
  "Walk-in",
];

const initialState = {
  business_name: "",
  customer_name: "",
  customer_phone: "",
  service_category: "",
  customer_message: "",
  lead_source: "",
};

export default function Capture() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.business_name.trim()) e.business_name = "Required";
    if (!form.customer_name.trim()) e.customer_name = "Required";
    if (!form.customer_phone.trim()) e.customer_phone = "Required";
    if (!form.service_category) e.service_category = "Required";
    if (!form.customer_message.trim()) e.customer_message = "Required";
    if (!form.lead_source) e.lead_source = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (evt) => {
    evt.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const lead = await createLead(form);
      toast.success("Lead captured", {
        description: `${lead.customer_name} added to your pipeline.`,
      });
      navigate(`/leads/${lead.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Could not save lead. Check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "bg-zinc-950 border-zinc-800 rounded-sm focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500 text-zinc-100 placeholder:text-zinc-600";

  return (
    <div className="fade-up max-w-3xl mx-auto px-6 py-12" data-testid="capture-page">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        data-testid="capture-back-btn"
        className="text-zinc-400 hover:text-zinc-100 mb-6 -ml-3"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back
      </Button>

      <div className="mb-10">
        <p className="text-xs font-bold tracking-widest uppercase text-orange-500 mb-3">
          /// New Lead
        </p>
        <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-zinc-50">
          Capture a missed lead
        </h1>
        <p className="mt-3 text-zinc-400 max-w-xl">
          Log the details while they&apos;re fresh. You can update the status and generate a
          follow-up message on the next screen.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6" data-testid="capture-form">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Business name" error={errors.business_name} htmlFor="business_name">
            <Input
              id="business_name"
              data-testid="input-business-name"
              className={inputCls}
              value={form.business_name}
              onChange={(e) => set("business_name", e.target.value)}
              placeholder="Redline Plumbing Co."
            />
          </Field>
          <Field label="Customer name" error={errors.customer_name} htmlFor="customer_name">
            <Input
              id="customer_name"
              data-testid="input-customer-name"
              className={inputCls}
              value={form.customer_name}
              onChange={(e) => set("customer_name", e.target.value)}
              placeholder="Marcus Reed"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Customer phone" error={errors.customer_phone} htmlFor="customer_phone">
            <Input
              id="customer_phone"
              data-testid="input-customer-phone"
              className={inputCls}
              value={form.customer_phone}
              onChange={(e) => set("customer_phone", e.target.value)}
              placeholder="(415) 555-0142"
              type="tel"
            />
          </Field>
          <Field label="Service category" error={errors.service_category}>
            <Select
              value={form.service_category}
              onValueChange={(v) => set("service_category", v)}
            >
              <SelectTrigger
                data-testid="select-service-category"
                className={`${inputCls} h-10`}
              >
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800">
                {SERVICE_CATEGORIES.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    data-testid={`option-service-${s.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Lead source" error={errors.lead_source}>
          <Select value={form.lead_source} onValueChange={(v) => set("lead_source", v)}>
            <SelectTrigger data-testid="select-lead-source" className={`${inputCls} h-10`}>
              <SelectValue placeholder="Where did it come from?" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-950 border-zinc-800">
              {LEAD_SOURCES.map((s) => (
                <SelectItem
                  key={s}
                  value={s}
                  data-testid={`option-source-${s.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-zinc-100 focus:bg-zinc-800 focus:text-zinc-100"
                >
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Customer message" error={errors.customer_message} htmlFor="customer_message">
          <Textarea
            id="customer_message"
            data-testid="input-customer-message"
            className={`${inputCls} min-h-[140px] resize-y`}
            value={form.customer_message}
            onChange={(e) => set("customer_message", e.target.value)}
            placeholder="What did the customer need? Any timing or urgency notes?"
          />
        </Field>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setForm(initialState)}
            data-testid="capture-reset-btn"
            className="text-zinc-400 hover:text-zinc-100"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            data-testid="capture-submit-btn"
            className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold uppercase tracking-wider rounded-sm px-8"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Save Lead
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

const Field = ({ label, error, htmlFor, children }) => (
  <div className="space-y-2">
    <Label
      htmlFor={htmlFor}
      className="text-xs font-bold tracking-widest uppercase text-zinc-400"
    >
      {label}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-red-400 font-medium" data-testid={`error-${htmlFor || label}`}>
        {error}
      </p>
    )}
  </div>
);
