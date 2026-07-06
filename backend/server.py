from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="LocalOps API")
api_router = APIRouter(prefix="/api")

LeadStatus = Literal["new", "contacted", "booked", "lost"]


# ---------- Models ----------
class Note(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    body: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_name: str
    customer_name: str
    customer_phone: str
    service_category: str
    customer_message: str
    lead_source: str
    status: LeadStatus = "new"
    received_time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    notes: List[Note] = Field(default_factory=list)


class LeadCreate(BaseModel):
    business_name: str
    customer_name: str
    customer_phone: str
    service_category: str
    customer_message: str
    lead_source: str


class LeadStatusUpdate(BaseModel):
    status: LeadStatus


class NoteCreate(BaseModel):
    body: str


# ---------- Helpers ----------
def _serialize(lead_doc: dict) -> dict:
    """Convert stored ISO datetime strings back to datetime for Pydantic."""
    if isinstance(lead_doc.get("received_time"), str):
        lead_doc["received_time"] = datetime.fromisoformat(lead_doc["received_time"])
    for n in lead_doc.get("notes", []) or []:
        if isinstance(n.get("created_at"), str):
            n["created_at"] = datetime.fromisoformat(n["created_at"])
    return lead_doc


async def _seed_leads_if_empty():
    count = await db.leads.count_documents({})
    if count > 0:
        return

    now = datetime.now(timezone.utc)
    seeds = [
        Lead(
            business_name="Redline Plumbing Co.",
            customer_name="Marcus Reed",
            customer_phone="(415) 555-0142",
            service_category="Plumbing",
            customer_message="Water heater started leaking overnight. Need someone out ASAP — happy to pay a call-out fee.",
            lead_source="Missed Call",
            status="new",
            received_time=now - timedelta(minutes=18),
        ),
        Lead(
            business_name="Ironclad Roofing",
            customer_name="Sandra Nguyen",
            customer_phone="(206) 555-0199",
            service_category="Roofing",
            customer_message="Storm damage on the back slope, insurance adjuster wants an estimate this week.",
            lead_source="Website Form",
            status="contacted",
            received_time=now - timedelta(hours=3, minutes=42),
        ),
        Lead(
            business_name="Foreman Electric",
            customer_name="Devon Alvarez",
            customer_phone="(512) 555-0170",
            service_category="Electrical",
            customer_message="Panel keeps tripping when the AC kicks on. Want to book a diagnostic Friday.",
            lead_source="Google Ads",
            status="booked",
            received_time=now - timedelta(hours=8),
        ),
        Lead(
            business_name="Redline Plumbing Co.",
            customer_name="Priya Kapoor",
            customer_phone="(646) 555-0117",
            service_category="Plumbing",
            customer_message="Kitchen sink slow drain, tried snaking, no luck. Looking for a quote.",
            lead_source="Referral",
            status="new",
            received_time=now - timedelta(hours=26),
        ),
        Lead(
            business_name="Timberline Remodeling",
            customer_name="Jake Whitman",
            customer_phone="(303) 555-0164",
            service_category="General Contracting",
            customer_message="Interested in a bathroom remodel — hoped to start early next month.",
            lead_source="Missed Text",
            status="lost",
            received_time=now - timedelta(days=2, hours=4),
        ),
    ]
    docs = []
    for lead in seeds:
        d = lead.model_dump()
        d["received_time"] = d["received_time"].isoformat()
        docs.append(d)
    await db.leads.insert_many(docs)


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "LocalOps API online"}


@api_router.post("/leads", response_model=Lead)
async def create_lead(payload: LeadCreate):
    lead = Lead(**payload.model_dump())
    doc = lead.model_dump()
    doc["received_time"] = doc["received_time"].isoformat()
    await db.leads.insert_one(doc)
    return lead


@api_router.get("/leads", response_model=List[Lead])
async def list_leads():
    docs = await db.leads.find({}, {"_id": 0}).to_list(1000)
    docs = [_serialize(d) for d in docs]
    # newest first
    docs.sort(key=lambda d: d["received_time"], reverse=True)
    return docs


@api_router.get("/leads/{lead_id}", response_model=Lead)
async def get_lead(lead_id: str):
    doc = await db.leads.find_one({"id": lead_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _serialize(doc)


@api_router.patch("/leads/{lead_id}/status", response_model=Lead)
async def update_lead_status(lead_id: str, payload: LeadStatusUpdate):
    result = await db.leads.find_one_and_update(
        {"id": lead_id},
        {"$set": {"status": payload.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _serialize(result)


@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"ok": True}


@api_router.post("/leads/{lead_id}/notes", response_model=Lead)
async def add_note(lead_id: str, payload: NoteCreate):
    body = payload.body.strip()
    if not body:
        raise HTTPException(status_code=400, detail="Note body cannot be empty")
    note = Note(body=body)
    note_doc = note.model_dump()
    note_doc["created_at"] = note_doc["created_at"].isoformat()
    result = await db.leads.find_one_and_update(
        {"id": lead_id},
        {"$push": {"notes": note_doc}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _serialize(result)


@api_router.delete("/leads/{lead_id}/notes/{note_id}", response_model=Lead)
async def delete_note(lead_id: str, note_id: str):
    result = await db.leads.find_one_and_update(
        {"id": lead_id},
        {"$pull": {"notes": {"id": note_id}}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    return _serialize(result)


@api_router.get("/stats")
async def stats():
    docs = await db.leads.find({}, {"_id": 0, "status": 1}).to_list(2000)
    counts = {"new": 0, "contacted": 0, "booked": 0, "lost": 0}
    for d in docs:
        s = d.get("status", "new")
        if s in counts:
            counts[s] += 1
    counts["total"] = sum(counts.values())
    return counts


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("startup")
async def on_startup():
    try:
        await _seed_leads_if_empty()
        logger.info("Seed check complete")
    except Exception as e:
        logger.exception("Seed failed: %s", e)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
