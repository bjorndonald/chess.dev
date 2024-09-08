import { object, string } from "zod";

export const createGameSchema = object({
    type: string({ required_error: "Game Type is required" }).min(
        1,
        "Game Type is required"
    ),
    owner: string({ required_error: "Email is required" }).email(),
    pgnString: string({ required_error: "PGN string is required" }),
    white: string({ required_error: "White player is required" }),
    black: string({ required_error: "Black player is required" }),
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