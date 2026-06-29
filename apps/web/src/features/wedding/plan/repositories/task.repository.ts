import "server-only";

import { pool } from "@/server/db/pool";

import type { WeddingTask } from "@/features/wedding/plan/types";

type WeddingTaskRow = {
  id: string;
  wedding_project_id: string;
  title: string;
  category: string;
  due_date: string | null;
  status: "todo" | "in_progress" | "done";
  memo: string | null;
  created_at: Date;
  updated_at: Date;
};

type CreateWeddingTaskParams = {
  householdId: string;
  weddingProjectId: string;
  title: string;
  category: string;
  dueDate?: string;
  memo?: string;
};

export async function getWeddingTasks(params: {
  householdId: string;
  weddingProjectId: string;
}) {
  const result = await pool.query<WeddingTaskRow>(
    `
      select wt.*
      from wedding_tasks wt
      join wedding_projects wp on wp.id = wt.wedding_project_id
      where wt.wedding_project_id = $1
        and wp.household_id = $2
      order by wt.due_date nulls last, wt.created_at asc
    `,
    [params.weddingProjectId, params.householdId],
  );

  return result.rows.map(mapWeddingTaskRow);
}

export async function createWeddingTask(params: CreateWeddingTaskParams) {
  const result = await pool.query<WeddingTaskRow>(
    `
      insert into wedding_tasks (
        wedding_project_id,
        title,
        category,
        due_date,
        memo
      )
      select $1, $2, $3, $4, $5
      from wedding_projects wp
      where wp.id = $1
        and wp.household_id = $6
      returning *
    `,
    [
      params.weddingProjectId,
      params.title,
      params.category,
      params.dueDate ?? null,
      params.memo ?? null,
      params.householdId,
    ],
  );

  const task = result.rows[0];

  if (!task) {
    throw new Error("Wedding project was not found for this household.");
  }

  return mapWeddingTaskRow(task);
}

export async function updateWeddingTaskStatus(params: {
  householdId: string;
  taskId: string;
  status: WeddingTaskRow["status"];
}) {
  const result = await pool.query<WeddingTaskRow>(
    `
      update wedding_tasks wt
      set status = $1,
          updated_at = now()
      from wedding_projects wp
      where wt.wedding_project_id = wp.id
        and wt.id = $2
        and wp.household_id = $3
      returning wt.*
    `,
    [params.status, params.taskId, params.householdId],
  );

  const task = result.rows[0];

  if (!task) {
    throw new Error("Wedding task was not found for this household.");
  }

  return mapWeddingTaskRow(task);
}

export async function deleteWeddingTask(params: {
  householdId: string;
  taskId: string;
}) {
  const result = await pool.query<Pick<WeddingTaskRow, "id">>(
    `
      delete from wedding_tasks wt
      using wedding_projects wp
      where wt.wedding_project_id = wp.id
        and wt.id = $1
        and wp.household_id = $2
      returning wt.id
    `,
    [params.taskId, params.householdId],
  );

  if (!result.rows[0]) {
    throw new Error("Wedding task was not found for this household.");
  }
}

function mapWeddingTaskRow(row: WeddingTaskRow): WeddingTask {
  return {
    id: row.id,
    weddingProjectId: row.wedding_project_id,
    title: row.title,
    category: row.category,
    dueDate: row.due_date,
    status: row.status,
    memo: row.memo,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
