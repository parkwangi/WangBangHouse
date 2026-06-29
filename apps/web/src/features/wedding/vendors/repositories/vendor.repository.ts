import "server-only";

import { pool } from "@/server/db/pool";

import type { Vendor } from "@/features/wedding/vendors/types";

type VendorRow = {
  id: string;
  household_id: string;
  name: string;
  category: string;
  phone: string | null;
  address: string | null;
  memo: string | null;
  created_at: Date;
  updated_at: Date;
};

type CreateVendorParams = {
  householdId: string;
  name: string;
  category: string;
  phone?: string;
  address?: string;
  memo?: string;
};

export async function getVendors(params: { householdId: string }) {
  const result = await pool.query<VendorRow>(
    `
      select *
      from vendors
      where household_id = $1
      order by category asc, name asc, created_at asc
    `,
    [params.householdId],
  );

  return result.rows.map(mapVendorRow);
}

export async function createVendor(params: CreateVendorParams) {
  const result = await pool.query<VendorRow>(
    `
      insert into vendors (
        household_id,
        name,
        category,
        phone,
        address,
        memo
      )
      values ($1, $2, $3, $4, $5, $6)
      returning *
    `,
    [
      params.householdId,
      params.name,
      params.category,
      params.phone ?? null,
      params.address ?? null,
      params.memo ?? null,
    ],
  );

  return mapVendorRow(result.rows[0]);
}

function mapVendorRow(row: VendorRow): Vendor {
  return {
    id: row.id,
    householdId: row.household_id,
    name: row.name,
    category: row.category,
    phone: row.phone,
    address: row.address,
    memo: row.memo,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}
