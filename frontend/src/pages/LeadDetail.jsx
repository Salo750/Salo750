import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Copy,
  RefreshCw,
  Trash2,
  Phone,
  Building2,
  MessageSquareText,
  Wrench,
  Radio,
  Clock,
  CheckCircle2,
  StickyNote,
  Send,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import StatusBadge from "@/components/StatusBadge";
import { getLead, updateLeadStatus, deleteLead, addNote, deleteNote } from "@/lib/api";
import { STATUSES, shortId, timeAgo } from "@/lib/format";
import { TEMPLATES, renderTemplate } from "@/lib/templates";

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [message, setMessage] = useState("");
  const [statusSaving, setStatusSaving] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteSaving, setNoteSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getLead(id);
      setLead(data);
      const tpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
      setMessage(renderTemplate(tpl, data));
    } catch (e) {
      console.error(e);
      toast.error("Lead not found");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
     
  }, [id]);

  const regenerate = () => {
    const tpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    setMessage(renderTemplate(tpl, lead));
    toast.success("Message regenerated");
  };

  const onTemplateChange = (val) => {
    setTemplateId(val);
    const tpl = TEMPLATES.find((t) => t.id === val);
    if (tpl && lead) setMessage(renderTemplate(tpl, lead));
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy — select and copy manually");
    }
  };

  const changeStatus = async (next) => {
    if (!lead || next === lead.status) return;
    setStatusSaving(true);
    try {
      const updated = await updateLeadStatus(lead.id, next);
      setLead(updated);
      toast.success(`Status → ${next}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    } finally {
      setStatusSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteLead(lead.id);
      toast.success("Lead deleted");
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete");
    }
  };

  const submitNote = async () => {
    const body = noteDraft.trim();
    if (!body) return;
    setNoteSaving(true);
    try {
      const updated = await addNote(lead.id, body);
      setLead(updated);
      setNoteDraft("");
      toast.success("Note added");
    } catch (e) {
      console.error(e);
      toast.error("Could not add note");
    } finally {
      setNoteSaving(false);
    }
  };

  const removeNote = async (noteId) => {
    try {
      const updated = await deleteNote(lead.id, noteId);
      setLead(updated);
      toast.success("Note deleted");
    } catch (e) {
      console.error(e);
      toast.error("Could not delete note");
    }
  };

  if (loading || !lead) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12" data-testid="lead-detail-loading">
        <div className="h-8 w-40 bg-zinc-900 animate-pulse rounded-sm mb-6" />
        <div className="h-64 bg-zinc-900 animate-pulse rounded-sm" />
      </div>
    );
  }

  return (
    <div className="fade-up max-w-6xl mx-auto px-6 py-10" data-testid="lead-detail-page">
      {/* HEADER */}
      <Button
        variant="ghost"
        onClick={() => navigate("/dashboard")}
        data-testid="detail-back-btn"
        className="text-zinc-400 hover:text-zinc-100 mb-6 -ml-3"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Dashboard
      </Button>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 pb-8 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span
              data-testid="detail-lead-id"
              className="font-mono text-xs text-orange-500 border border-orange-500/40 bg-orange-500/10 px-2 py-0.5 rounded-sm"
            >
              #{shortId(lead.id)}
            </span>
            <StatusBadge status={lead.status} testid="detail-status-badge" />
          </div>
          <h1
            data-testid="detail-customer-name"
            className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-zinc-50"
          >
            {lead.customer_name}
          </h1>
          <p className="mt-2 text-zinc-400">
            {lead.business_name} · Received {timeAgo(lead.received_time)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              value={lead.status}
              onValueChange={changeStatus}
              disabled={statusSaving}
            >
              <SelectTrigger
                data-testid="detail-status-select"
                className="bg-zinc-950 border-zinc-800 rounded-sm text-zinc-100 h-10 uppercase tracking-wider text-xs font-bold"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-950 border-zinc-800">
                {STATUSES.map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    data-testid={`detail-status-option-${s}`}
                    className="text-zinc-100 focus:bg-zinc-800 capitalize"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                data-testid="detail-delete-btn"
                className="bg-transparent border-zinc-800 hover:bg-red-950 hover:text-red-400 hover:border-red-900 text-zinc-400 rounded-sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-testid="delete-confirm-dialog"
              className="bg-zinc-950 border-zinc-800 rounded-sm"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="font-display uppercase tracking-tight text-zinc-50">
                  Delete this lead?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This lead will be permanently removed from your pipeline. This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  data-testid="delete-cancel-btn"
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800 rounded-sm"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={confirmDelete}
                  data-testid="delete-confirm-btn"
                  className="bg-red-600 hover:bg-red-700 text-white rounded-sm"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* STATUS TRACK */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3">
          /// Pipeline stage
        </p>
        <div className="grid grid-cols-4 gap-2" data-testid="status-track">
          {STATUSES.map((s, i) => {
            const active = STATUSES.indexOf(lead.status) >= i;
            const current = lead.status === s;
            return (
              <button
                key={s}
                type="button"
                onClick={() => changeStatus(s)}
                disabled={statusSaving}
                data-testid={`status-step-${s}`}
                className={`p-3 rounded-sm text-left border transition-all ${
                  current
                    ? "bg-orange-500/10 border-orange-500 text-orange-400"
                    : active
                    ? "bg-zinc-900 border-zinc-700 text-zinc-300"
                    : "bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono">{String(i + 1).padStart(2, "0")}</span>
                  {current && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <div className="text-sm font-bold uppercase tracking-wider mt-1 capitalize">
                  {s}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* LEFT: DETAILS */}
        <div className="lg:col-span-2 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
            /// Lead Details
          </p>
          <DetailRow icon={Building2} label="Business" value={lead.business_name} />
          <DetailRow icon={Phone} label="Phone" value={lead.customer_phone} mono />
          <DetailRow icon={Wrench} label="Service" value={lead.service_category} />
          <DetailRow icon={Radio} label="Source" value={lead.lead_source} />
          <DetailRow icon={Clock} label="Received" value={new Date(lead.received_time).toLocaleString()} />

          <div className="border border-zinc-800 bg-zinc-900/40 rounded-sm p-4 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareText className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Customer Message
              </span>
            </div>
            <p
              data-testid="detail-customer-message"
              className="text-zinc-200 leading-relaxed whitespace-pre-wrap"
            >
              {lead.customer_message}
            </p>
          </div>
        </div>

        {/* RIGHT: FOLLOW-UP GENERATOR */}
        <div className="lg:col-span-3">
          <div className="border border-zinc-800 bg-zinc-900/40 rounded-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-1">
                  /// Follow-up
                </p>
                <h2 className="font-display font-black text-2xl uppercase tracking-tight text-zinc-50">
                  Generate a message
                </h2>
              </div>
              <div className="w-52">
                <Select value={templateId} onValueChange={onTemplateChange}>
                  <SelectTrigger
                    data-testid="template-select"
                    className="bg-zinc-950 border-zinc-800 rounded-sm text-zinc-100 h-10 text-xs font-bold uppercase tracking-wider"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border-zinc-800">
                    {TEMPLATES.map((t) => (
                      <SelectItem
                        key={t.id}
                        value={t.id}
                        data-testid={`template-option-${t.id}`}
                        className="text-zinc-100 focus:bg-zinc-800"
                      >
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Textarea
              data-testid="followup-message-textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[220px] bg-zinc-950 border-zinc-800 rounded-sm text-zinc-100 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500 leading-relaxed"
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
              <span className="text-xs text-zinc-500 uppercase tracking-widest">
                {message.length} chars · Template-based · No SMS sent
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={regenerate}
                  data-testid="followup-regenerate-btn"
                  className="bg-transparent border-zinc-800 hover:bg-zinc-900 text-zinc-200 rounded-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
                </Button>
                <Button
                  onClick={copyMessage}
                  data-testid="followup-copy-btn"
                  className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold uppercase tracking-wider rounded-sm"
                >
                  <Copy className="w-4 h-4 mr-2" /> Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 border border-dashed border-zinc-800 rounded-sm p-4 text-xs text-zinc-500 leading-relaxed">
            <span className="font-bold uppercase tracking-widest text-zinc-400">Demo note:</span>{" "}
            Messages are generated from templates and merged with lead data. Nothing is sent —
            copy the message and paste it into your own SMS or email client.
          </div>

          {/* ACTIVITY NOTES */}
          <div
            className="mt-6 border border-zinc-800 bg-zinc-900/40 rounded-sm p-6"
            data-testid="notes-panel"
          >
            <div className="flex items-center gap-2 mb-4">
              <StickyNote className="w-4 h-4 text-orange-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-500">
                /// Activity Notes
              </p>
              <span
                data-testid="notes-count"
                className="ml-auto text-[10px] font-bold uppercase tracking-widest text-zinc-500"
              >
                {(lead.notes || []).length} logged
              </span>
            </div>

            <div className="flex gap-2 mb-4">
              <Textarea
                data-testid="note-input"
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Left voicemail · Sent quote · Callback scheduled for Fri…"
                className="min-h-[70px] bg-zinc-950 border-zinc-800 rounded-sm text-zinc-100 focus-visible:ring-1 focus-visible:ring-orange-500 focus-visible:border-orange-500 resize-y flex-1"
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    e.preventDefault();
                    submitNote();
                  }
                }}
              />
              <Button
                onClick={submitNote}
                disabled={noteSaving || !noteDraft.trim()}
                data-testid="note-submit-btn"
                className="bg-orange-500 hover:bg-orange-600 text-zinc-950 font-bold uppercase tracking-wider rounded-sm self-stretch px-4"
              >
                {noteSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {(lead.notes || []).length === 0 ? (
              <div
                data-testid="notes-empty"
                className="text-center text-xs uppercase tracking-widest text-zinc-600 border border-dashed border-zinc-800 rounded-sm py-6"
              >
                No notes yet. Log the first call, text, or callback.
              </div>
            ) : (
              <ul className="space-y-2" data-testid="notes-list">
                {[...(lead.notes || [])]
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map((n) => (
                    <li
                      key={n.id}
                      data-testid={`note-item-${n.id}`}
                      className="group border-l-2 border-orange-500/60 bg-zinc-950/60 rounded-sm p-3 flex items-start gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-200 leading-relaxed whitespace-pre-wrap break-words">
                          {n.body}
                        </p>
                        <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">
                          {timeAgo(n.created_at)} · {new Date(n.created_at).toLocaleString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeNote(n.id)}
                        data-testid={`note-delete-${n.id}`}
                        aria-label="Delete note"
                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const DetailRow = ({ icon: Icon, label, value, mono }) => (
  <div className="border border-zinc-800 bg-zinc-900/40 rounded-sm p-4 flex items-start gap-3">
    <span className="grid place-items-center w-8 h-8 bg-zinc-950 border border-zinc-800 rounded-sm flex-shrink-0">
      <Icon className="w-4 h-4 text-orange-500" />
    </span>
    <div className="min-w-0 flex-1">
      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {label}
      </div>
      <div
        className={`text-zinc-100 mt-0.5 break-words ${mono ? "font-mono text-sm" : ""}`}
      >
        {value}
      </div>
    </div>
  </div>
);
