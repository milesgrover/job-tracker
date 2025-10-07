import { NextResponse } from "next/server";
import { queryWithRetry } from "../../../lib/db";
import { EventType, EventBody } from "@/types/events";

export async function POST(req: Request) {
  try {
    const body: EventBody = await req.json();

    // Step 1: insert the event
    const [result] = await queryWithRetry(
      `INSERT INTO job_events (job_id, event_type, event_date, details)
       VALUES (?, ?, ?, ?)`,
      [body.job_id, body.event_type, body.event_date, body.details ?? null]
    );

    const newId = result.insertId;

    // Step 2: fetch the full row to get DB-generated fields
    const [rows] = await queryWithRetry(
      `SELECT * FROM job_events WHERE id = ?`,
      [newId]
    );

    const newEvent = rows[0];

    return NextResponse.json(newEvent, { status: 201 });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to create event." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const job_id = url.searchParams.get("job_id");
  if (!job_id)
    return NextResponse.json({ error: "job_id required" }, { status: 400 });

  const [events] = await queryWithRetry(
    `SELECT * FROM job_events WHERE job_id = ? ORDER BY event_date ASC, id ASC`,
    [job_id]
  );
  return NextResponse.json(events);
}

export async function DELETE(req: Request) {
  const body: { id: number } = await req.json();

  const [event] = await queryWithRetry(
    `SELECT job_id FROM job_events WHERE id = ?`,
    [body.id]
  );
  if (!event)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });

  await queryWithRetry(`DELETE FROM job_events WHERE id = ?`, [body.id]);

  // Update job status
  const [latestRows] = await queryWithRetry(
    `SELECT event_type
     FROM job_events
     WHERE job_id = ?
     ORDER BY event_date DESC, id DESC
     LIMIT 1`,
    [event.job_id]
  );

  const latestType: EventType =
    latestRows.length > 0 ? latestRows[0].event_type : "applied";
  await queryWithRetry(`UPDATE jobs SET status = ? WHERE id = ?`, [
    latestType,
    event.job_id,
  ]);

  return NextResponse.json({ status: 201 });
}

export async function PUT(req: Request) {
  const body: EventBody = await req.json();
  if (!body.id)
    return NextResponse.json({ error: "id required" }, { status: 400 });

  const [event] = await queryWithRetry(
    `SELECT job_id FROM job_events WHERE id = ?`,
    [body.id]
  );
  if (!event)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });

  await queryWithRetry(
    `UPDATE job_events SET event_date = ?, event_type = ?, details = ? WHERE id = ?`,
    [body.event_date, body.event_type, body.details, body.id]
  );

  // Update job status
  const latestRows = await queryWithRetry(
    `SELECT event_type
     FROM job_events
     WHERE job_id = ?
     ORDER BY event_date DESC, id DESC
     LIMIT 1`,
    [event.job_id]
  );

  const latestType: EventType =
    latestRows.length > 0 ? latestRows[0].event_type : "applied";
  await queryWithRetry(`UPDATE jobs SET status = ? WHERE id = ?`, [
    latestType,
    event.job_id,
  ]);

  return NextResponse.json({ status: 201 });
}
