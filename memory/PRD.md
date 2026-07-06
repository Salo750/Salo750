# LocalOps — Product Requirements Document

## Problem Statement (Original)
Build LocalOps: an AI lead recovery web app for small contractors who miss calls, texts, and follow-ups. Help a contractor capture a missed lead, organize the lead, track status, and prepare a safe follow-up message. First version is a local/demo MVP only.

## User Choices (2026-02)
- Follow-up: **template-based** (no AI)
- Theme: **dark mode by default** (Zinc + Orange industrial)
- Seed: **5 sample leads** pre-loaded

## Architecture
- **Backend**: FastAPI + Motor + MongoDB. All routes under `/api`. Startup hook seeds 5 sample leads if collection empty.
- **Frontend**: React 19 + React Router + Tailwind + shadcn/ui, sonner toasts, lucide-react icons, Barlow + IBM Plex Sans (Google Fonts).
- **State**: Leads persisted in MongoDB `leads` collection. UUID `id` field (not ObjectId). `received_time` stored as ISO string.

## User Personas
- **Solo/small-crew contractor** (plumber, electrician, roofer, etc.) working from a truck. Needs 30-second workflow, mobile-friendly, no setup.

## Core Requirements (static)
1. Home page with product explainer + CTAs
2. Lead Capture form: business_name, customer_name, customer_phone, service_category, customer_message, lead_source
3. Lead Dashboard: table/cards, filterable, searchable, stats
4. Lead Detail: full info + template-based follow-up generator + status controls
5. Status pipeline: New → Contacted → Booked → Lost
6. Demo-only: no real SMS, no payments, mock data only

## What's Been Implemented (2026-02-06)
- Backend endpoints: `GET /api/leads`, `GET /api/leads/{id}`, `POST /api/leads`, `PATCH /api/leads/{id}/status`, `DELETE /api/leads/{id}`, `GET /api/stats`
- Seed of 5 realistic sample leads across all 4 statuses
- Home page with hero, 3-step feature grid, "why it matters" section, sample follow-up preview, footer
- Capture form with validation, service/source dropdowns, toast confirmations
- Dashboard: 5 stat cards, search box, status filter, responsive table (desktop) + card list (mobile)
- Lead Detail: pipeline step buttons + status Select dropdown, 4 message templates with placeholder substitution, regenerate + copy actions, delete with confirm dialog
- Sticky navbar with brand + 3 nav links
- Full data-testid coverage on all interactive elements
- Testing agent: **100% pass on backend + frontend**

## Prioritized Backlog

### P1 (next iteration)
- Sort controls on dashboard table (received time, business, status)
- Bulk actions (multi-select + mark contacted)
- Lead notes / activity log per lead
- Export leads to CSV

### P2
- Real AI-generated follow-ups (Claude Sonnet via Emergent Universal Key)
- Multiple businesses per account (multi-tenant)
- Auth (JWT or Emergent Google)
- Twilio SMS integration (real send)
- Web widget / public capture URL per business

### P3
- Analytics: response time, conversion rate by source
- Reminders / scheduled follow-ups
- Reporting dashboard
