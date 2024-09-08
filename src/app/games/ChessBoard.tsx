import React from "react";
import graphics from "../../../chess/graphics";
import { Color, PieceSymbol, Square } from "chess.js";

const ChessBoard = ({
  board,
}: {
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
}) => {
  // console.log(board)
  return (
    <div
      id="board"
      className="grid w-[144px] grid-rows-[repeat(8,_20px)]  gap-0"
    >
      {board.map((y, i) => (
        <div
          key={i}
          className={`row grid w-full shrink-0 grid-cols-[repeat(8,_18px)] ${i % 2 === 0 ? "bg-light" : "bg-dark"}`}
        >
          {y.map((x, j) => {
            // console.log(x)
            return (
              <div
                key={j}
                dangerouslySetInnerHTML={{
                  __html: x ? graphics[x.type][x.color] : "",
                }}
                className={`square center relative h-[20px] shrink-0 [&_svg]:h-[18px] [&_svg]:w-[18px] ${i % 2 === 0 ? (j % 2 === 0 ? "bg-dark" : "bg-light") : j % 2 === 0 ? "bg-light" : "bg-dark"}`}
              ></div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
