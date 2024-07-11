import {
    timestamp,
    pgTable,
    text,
    numeric
} from "drizzle-orm/pg-core"

export const games = pgTable("games", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    type: text("type"),
    pgnString: text("pgnString"),
    white: text("white"),
    black: text("black"),
    created_at: timestamp("created_at", { mode: "date" }),
    updated_at: timestamp("updated_at", { mode: "date" })
})