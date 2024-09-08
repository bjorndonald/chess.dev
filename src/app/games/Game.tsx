import type Game from "@/types/game";
import React from "react";
import ChessBoard from "./ChessBoard";
import { Chess } from "chess.js";
import moment from "moment";
import DotMenu from "./DotMenu";
import Link from "next/link";

const GameComponent = ({ game }: { game: Game }) => {
  const chess = new Chess();
  if (game.pgnstring) chess.loadPgn(game.pgnstring);
  return (
    <div className="relative">
      <Link
        href={`/game/${game.id}`}
        className="border-gray-200 relative flex w-full gap-2 overflow-hidden rounded-md border-2"
      >
        <ChessBoard board={chess.board()} />
        <div className="flex flex-col  gap-2 pt-4">
          <h2 className="text-xl font-semibold capitalize">
            {game.white} vs {game.black}
          </h2>
          <h4 className="text-lg font-semibold capitalize">
            {chess.isGameOver() ? "Game Over" : "Playing"}
          </h4>
          {chess.isCheckmate() && (
            <h4 className="text-lg font-semibold capitalize">
              Winner: {chess.turn() === "w" ? game.black : game.white}
            </h4>
          )}
          {chess.isDraw() && (
            <h4 className="text-lg font-semibold capitalize">
              Game has been drawn
            </h4>
          )}
          <p className="text-gray-500 text-sm">
            {moment(game.updated_at).format("DD MMM YYYY HH:mm")}
          </p>
        </div>
      </Link>
      <div className="absolute right-4 top-4 z-10">
        <DotMenu id={game.id} />
      </div>
    </div>
  );
};

export default GameComponent;
