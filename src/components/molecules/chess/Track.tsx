import Game from "@/types/game";
import { Chess } from "chess.js";
import React from "react";
import { YOU } from "./strings";

interface Props {
  pgnString: string;
  game: Game;
}

const Track = ({ pgnString, game }: Props) => {
  const chess = new Chess();
  chess.loadPgn(pgnString);

  if (chess.isGameOver()) {
    if (chess.isStalemate()) {
      return (
        <h1 className="md:text-4xl mb-4 mt-8  text-center font-pistilli text-3xl font-bold">
          The game is a draw 🤔
        </h1>
      );
    }
    if (chess.isCheckmate()) {
      return (
        <h1 className="md:text-4xl mb-4 mt-8  text-center font-pistilli text-3xl font-bold">
          The game is on checkmate. {chess.turn() === "w" ? "Black" : "White"}{" "}
          wins!
        </h1>
      );
    }
  }
  if (
    (chess.turn() === "w" && game.white === YOU.value.toLowerCase()) ||
    (chess.turn() === "b" && game.black === YOU.value.toLowerCase())
  ) {
    return null;
  }
  return (
    <h1 className="md:text-4xl mb-4 mt-8 text-center font-pistilli text-3xl font-bold">
      It's {chess.turn() === "w" ? "White" : "Black"}'s turn{" "}
      {chess.turn() === "b" ? "♙" : "♟"}
    </h1>
  );
};

export default Track;
