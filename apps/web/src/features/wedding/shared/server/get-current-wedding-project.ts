import "server-only";

export async function getCurrentWeddingProjectId() {
  const weddingProjectId = process.env.DEV_WEDDING_PROJECT_ID;

  if (!weddingProjectId) {
    throw new Error(
      "DEV_WEDDING_PROJECT_ID is required until project selection is implemented.",
    );
  }

  return weddingProjectId;
}
