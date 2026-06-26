export interface PaginationQuery {
    page?: string;
    limit?: string;
}
export interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
}
export declare function getPagination(query: PaginationQuery): PaginationResult;
export declare function paginatedResponse<T>(data: T[], total: number, page: number, limit: number): {
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
};
