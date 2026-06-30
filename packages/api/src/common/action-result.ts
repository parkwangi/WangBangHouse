export type ApiActionResult<TData = void> =
  | {
      ok: true;
      data?: TData;
    }
  | {
      ok: false;
      message?: string;
      errors?: Record<string, string[] | undefined>;
    };
