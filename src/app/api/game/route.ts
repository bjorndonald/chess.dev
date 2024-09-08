import { db } from "@/database";
import { games } from "@/database/schema";
import { ZodError } from "zod";
import { createGameSchema } from "@/lib/game-schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

type NewGame = typeof games.$inferInsert;
const insertGame = async (game: NewGame) => {
  const result = await db.insert(games).values(game).returning();
  return result[0];
};

export async function POST(req: Request) {
  try {
    const { pgnString, owner, type, white, black } = createGameSchema.parse(
      await req.json(),
    );

    const gameList = await db
      .select()
      .from(games)
      .where(eq(games.owner, owner));

    if (gameList.length > 5) {
      return NextResponse.json(
        {
          status: "error",
          message: "You have alrady saved 5 games",
        },
        { status: 401 },
      );
    }
    const game = await insertGame({
      black,
      pgnString,
      owner,
      type,
      white,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return NextResponse.json({
      game: {
        id: game.id,
        type: game.type,
        owner: game.owner,
        pgnString: game.pgnstring,
        white: game.white,
        black: game.black,
        created_at: game.created_at,
        updated_at: game.updated_at,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          status: "error",
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
