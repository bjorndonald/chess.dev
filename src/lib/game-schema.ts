import { number, object, string } from "zod";

export const createGameSchema = object({
    type: string({ required_error: "Game Type is required" }).min(
        1,
        "Game Type is required"
    ),
    userPick: string({ required_error: "Game Type is required" }).min(
        1,
        "User Pick is required"
    ),
    pgnString: string({ required_error: "PGN string is required" }),
    opponent: string().email({message: "Email is required"}).optional(),
    // white: number().min(99999, "White value is not supported").max(1000000, "White value is not supported"),
    // black: number().min(99999, "Black value is not supported").max(1000000, "White value is not supported")
});

export const updateGameSchema = object({
    from: string({ required_error: "From is required" }).min(
        1,
        "From is required"
    ),
    to: string({ required_error: "To is required" }).min(
        1,
        "To is required"
    )
});