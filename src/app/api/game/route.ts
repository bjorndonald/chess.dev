import { db } from "@/database";
import { games } from "@/database/schema";
import { ZodError } from "zod";
import { createGameSchema } from "@/lib/game-schema";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import CodeTemplate from "@/emails/CodeTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);
type NewGame = typeof games.$inferInsert;
const insertGame = async (game: NewGame) => {
  const result = await db.insert(games).values(game).returning();
  return result[0];
};

export async function POST(req: Request) {
  try {
    const { pgnString, type, userPick, opponent } = createGameSchema.parse(
      await req.json(),
    );

    const white = Math.floor(100000 + Math.random() * 900000);
    const black = Math.floor(100000 + Math.random() * 900000);

    const game = await insertGame({
      black,
      pgnString,
      type,
      white,
      created_at: new Date(),
      updated_at: new Date(),
    });
    if (game.type === "Remote") {
      await resend.emails.send({
        from: "Quick Chess <info@tuniko.info>",
        to: [`${opponent}`],
        subject: "New Chess Game",
        text: "",
        headers: {
          "X-Entity-Ref-ID": "123456789",
        },
        react: CodeTemplate({
          link: `${process.env.NEXTAUTH_URL}/${game.id}?player=${userPick === "w" ? black : white}`,
        }),
      });
    }

    return NextResponse.json({
      game: {
        id: game.id,
        type: game.type,
        pgnString: game.pgnString,
        ...(userPick === "w" ? { white: game.white } : {}),
        ...(userPick === "b" ? { black: game.black } : {}),
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
