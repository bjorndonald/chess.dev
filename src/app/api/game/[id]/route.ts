import { db } from "@/database";
import { games } from "@/database/schema";
import { updateGameSchema } from "@/lib/game-schema";
import axios from "axios";
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
    console.log(error.message);
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
    const game = await db
      .select()
      .from(games)
      .where(eq(games.id, params.id))[0];
    const chess = new Chess();
    chess.loadPgn(game.pgnString);
    const { from, to } = updateGameSchema.parse(await req.json());
    chess.move({ from, to });
    const updatedGame = await db
      .update(games)
      .set({
        pgnString: chess.pgn(),
        updated_at: new Date(),
      })
      .where(eq(games.id, params.id))
      .returning()[0];
    if (updatedGame.type === "Remote") {
      await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_URL + "/stream/" + game.id,
        {
          gameId: updatedGame.id,
          move: { from, to },
        },
      );
    }

    return NextResponse.json({
      game: updatedGame,
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
