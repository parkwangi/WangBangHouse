import "server-only";

export async function getCurrentHouseholdId() {
  const householdId = process.env.DEV_HOUSEHOLD_ID;

  if (!householdId) {
    throw new Error("DEV_HOUSEHOLD_ID is required until auth is implemented.");
  }

  return householdId;
}
