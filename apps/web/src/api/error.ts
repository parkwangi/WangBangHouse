import { isHTTPError } from "ky";

type ApiErrorResponse = {
  message?: string;
};

export async function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
) {
  if (!isHTTPError(error)) {
    return error instanceof Error ? error.message : fallbackMessage;
  }

  const body = (await error.response.json().catch(() => null)) as
    | ApiErrorResponse
    | null;

  return body?.message ?? fallbackMessage;
}
