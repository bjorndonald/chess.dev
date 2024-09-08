import { db } from "@/database";
import { games } from "@/database/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { owner, sortBy, filter } = await req.json();
    let gameList: any;
    console.log(owner);
    if (filter) {
      gameList = await db.select().from(games).where(eq(games.owner, owner));
    } else if (sortBy) {
      gameList = await db.select().from(games).where(eq(games.owner, owner));
    } else
      gameList = await db.select().from(games).where(eq(games.owner, owner));

    return NextResponse.json({
      games: gameList,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
