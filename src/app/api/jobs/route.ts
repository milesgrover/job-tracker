export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { queryWithRetry } from "@/lib/db";
import { Jobject, JobPostBody, JobUpdateBody } from "@/types/jobs";
import { EventType } from "@/types/events";

export async function POST(req: Request) {
  try {
    const body: JobPostBody = await req.json();

    // Step 1: insert the job
    const [result]: any = await queryWithRetry(
      `INSERT INTO jobs
        (url, title, company, location, pay_rate, requirements, applied_date, status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.url,
        body.title,
        body.company,
        body.location,
        body.pay_rate ?? null,
        body.requirements,
        body.applied_date,
        EventType.Applied,
        body.notes ?? null,
      ]
    );
    const newId = result.insertId;

    // Step 2: fetch the full row to get DB-generated fields (timestamps, defaults, etc.)
    const [rows] = await queryWithRetry<Jobject[]>(
      `SELECT * FROM jobs WHERE id = ?`,
      [newId]
    );
    const newJob = rows[0];
    return NextResponse.json(newJob, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error inserting job:", err.message, err.stack);
    } else {
      console.error("Unexpected error:", err);
    }
    return NextResponse.json(
      { success: false, error: "Failed to create job." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const [jobs] = await queryWithRetry<any[]>(
    `SELECT * FROM jobs ORDER BY applied_date DESC`
  );
  return NextResponse.json(jobs);
}

export async function PUT(req: Request) {
  const body: JobUpdateBody = await req.json();

  if (!body.id) {
    return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
  }

  // Build dynamic SET clause
  const fields: string[] = [];
  const values: (string | number)[] = [];
  const allowedFields: (keyof JobUpdateBody)[] = [
    "url",
    "title",
    "company",
    "location",
    "pay_rate",
    "requirements",
    "applied_date",
    "notes",
  ];

  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(body[key]);
    }
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  values.push(body.id);
  try {
    await queryWithRetry(
      `UPDATE jobs SET ${fields.join(", ")} WHERE id = ?`,
      values
    );

    const [rows] = await queryWithRetry<Jobject[]>(
      `SELECT * FROM jobs WHERE id = ?`,
      [body.id]
    );

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error inserting job:", err.message, err.stack);
    } else {
      console.error("Unexpected error:", err);
    }
    return NextResponse.json(
      { success: false, error: "Failed to create job." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const body: { id: number } = await req.json();

  if (!body.id)
    return NextResponse.json({ error: "Job ID required" }, { status: 400 });

  // delete all events for this job first
  await queryWithRetry(`DELETE FROM job_events WHERE job_id = ?`, [body.id]);

  // Then delete the job
  await queryWithRetry(`DELETE FROM jobs WHERE id = ?`, [body.id]);

  return NextResponse.json({ success: true });
}
