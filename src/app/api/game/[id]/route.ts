import { db } from "@/database";
import { games } from "@/database/schema";
import { updateGameSchema } from "@/lib/game-schema";
import { Chess } from "chess.js";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const game = await db.select().from(games).where(eq(games.id, params.id));
    if (game.length == 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Game not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      game: game[0],
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const game = await db.select().from(games).where(eq(games.id, params.id));
    if (game.length == 0) {
      return NextResponse.json(
        {
          status: "error",
          message: "Game not found",
        },
        { status: 404 },
      );
    }
    const chess = new Chess();
    chess.loadPgn(game[0].pgnString);
    const { from, to } = updateGameSchema.parse(await req.json());
    try {
      chess.move({ from, to });
    } catch (error) {
      // Invalid move
    }

    const updatedGame = await db
      .update(games)
      .set({
        pgnString: chess.pgn(),
        updated_at: new Date(),
      })
      .where(eq(games.id, params.id))
      .returning();

    return NextResponse.json({
      game: updatedGame[0],
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
