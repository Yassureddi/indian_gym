export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export function getPagination(query: PaginationQuery): PaginationResult {
  const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || "20", 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    },
  };
}
