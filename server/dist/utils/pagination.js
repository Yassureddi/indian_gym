export function getPagination(query) {
    const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || "20", 10) || 20));
    const skip = (page - 1) * limit;
    return { page, limit, skip };
}
export function paginatedResponse(data, total, page, limit) {
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
