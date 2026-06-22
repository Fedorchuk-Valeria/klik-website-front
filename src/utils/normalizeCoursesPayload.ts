import { Meta } from "@/src/entities/common";
import { COURSES_PAGE_SIZE } from "@/src/utils/constant";

export function normalizeCoursesPayload<T = unknown>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;

    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.results)) return record.results as T[];
  }

  return [];
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && !Number.isNaN(value)) return value;

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);

    return Number.isNaN(parsed) ? null : parsed;
  }

  return null;
}

function extractMeta(source: Record<string, unknown>): Meta | null {
  const page = parseNumber(source.page);
  const page_size = parseNumber(source.page_size);
  const total_count = parseNumber(source.total_count);
  const total_pages = parseNumber(source.total_pages);

  if (page === null || page_size === null) {
    return null;
  }

  if (total_count !== null && total_pages !== null) {
    return { page, page_size, total_count, total_pages };
  }

  if (total_count !== null) {
    return {
      page,
      page_size,
      total_count,
      total_pages: Math.max(page, Math.ceil(total_count / page_size)),
    };
  }

  if (total_pages !== null) {
    return {
      page,
      page_size,
      total_count: total_pages * page_size,
      total_pages,
    };
  }

  return null;
}

export function normalizeCoursesResponse<T = unknown>(
  payload: unknown,
  fallback?: Partial<Meta>
): { data: T[]; meta: Meta } {
  const data = normalizeCoursesPayload<T>(payload);
  const pageSize = fallback?.page_size ?? COURSES_PAGE_SIZE;
  const page = fallback?.page ?? 1;

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const nestedMeta =
      record.meta && typeof record.meta === "object"
        ? extractMeta(record.meta as Record<string, unknown>)
        : null;
    const rootMeta = extractMeta(record);

    if (nestedMeta) {
      return { data, meta: nestedMeta };
    }

    if (rootMeta) {
      return { data, meta: rootMeta };
    }
  }

  const totalPages =
    data.length >= pageSize ? page + 1 : page;

  return {
    data,
    meta: {
      page,
      page_size: pageSize,
      total_count: fallback?.total_count ?? data.length,
      total_pages: fallback?.total_pages ?? totalPages,
    },
  };
}
