import { body, param, query } from "express-validator";
export const attendanceIdValidator = [
    param("id").isMongoId().withMessage("Invalid attendance ID"),
];
export const listAttendanceValidator = [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("userId").optional().isMongoId(),
    query("date").optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    query("from").optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    query("to").optional().matches(/^\d{4}-\d{2}-\d{2}$/),
];
export const checkInValidator = [
    body("userId").optional().isMongoId(),
    body("date").optional().matches(/^\d{4}-\d{2}-\d{2}$/),
    body("checkIn").optional().matches(/^\d{2}:\d{2}$/),
];
export const checkOutValidator = [
    ...attendanceIdValidator,
    body("checkOut").optional().matches(/^\d{2}:\d{2}$/),
];
