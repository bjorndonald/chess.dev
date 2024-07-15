"use client";
import React, { useEffect, useState } from "react";
import RewindIcon from "./Rewind.icon";
import PreviousIcon from "./Previous.icon";
import NextIcon from "./Next.icon";
import FastForwardIcon from "./FastForward.icon";
import { Menu } from "react-feather";
import { Chess, Move } from "chess.js";
import Moves from "./Moves";
import Countdown from "./Countdown";
import { CHESS_GAME_PGN_STATE } from "@/constants/strings";
import { updateGame } from "@/actions/game";
import Game from "@/types/game";
import PlayerModal from "../Shared/PlayerModal";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CheckmateModal from "../Shared/CheckmateModal";

const GameType = {
  Local: "Local",
  Computer: "Computer",
  Remote: "Remote",
};

const YOU = { value: "You" };

interface Props {
  game: Game;
  player: string;
}

const SavedGame = ({ player, game }: Props) => {
  const navigate = useRouter();
  const [checkmate, setCheckmate] = useState(false);
  const [showMoves, setShowMoves] = useState(false);
  const [pgnString, setPgnString] = useState(game?.pgnString);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [whitePlayer] = useState(game.white === player ? YOU.value : "");
  const [blackPlayer] = useState(game.black === player ? YOU.value : "");

  useEffect(() => {
    localStorage.setItem(CHESS_GAME_PGN_STATE, game?.pgnString);
    if (!whitePlayer && !blackPlayer && game.type !== GameType.Local) {
      setShowPlayerModal(true);
    }

    window.addEventListener("message", handleEvent, false);
    return () => {
      window.removeEventListener("message", handleEvent, false);
    };
  }, []);

  const handleEvent = async (
    e: MessageEvent<{ pgnString: string; move: Move }>,
  ) => {
    console.log(e.origin, e.data);
    console.log(
      !process.env.NEXTAUTH_URL?.includes(e.origin) &&
      e.origin !== process.env.NEXT_PUBLIC_CHESS_PAGE
    )
    if (
      !process.env.NEXTAUTH_URL?.includes(e.origin) &&
      e.origin !== process.env.NEXT_PUBLIC_CHESS_PAGE
    ) {
      return;
    }

    setPgnString(e.data.pgnString);
    localStorage.setItem(CHESS_GAME_PGN_STATE, e.data.pgnString);
    await updateGame(game.id, {
      from: e.data.move.from,
      to: e.data.move.to,
    } as Move);
    const chess = new Chess();
    chess.loadPgn(pgnString);
    chess.inCheck() &&
      toast.success(`${chess.turn() === "w" ? "Black" : "White"} is in check`);
    chess.isCheckmate() && setCheckmate(true);
  };

  const undoMove = () => {
    const iframe = document.getElementById("chessGame") as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
      {
        action: "undo",
      },
      "*",
    );
  };

  const rewindGame = () => {
    const iframe = document.getElementById("chessGame") as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
      {
        action: "rewind",
      },
      "*",
    );
  };

  const redoMove = () => {
    const iframe = document.getElementById("chessGame") as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
      {
        action: "redo",
      },
      "*",
    );
  };

  const fastForward = () => {
    const iframe = document.getElementById("chessGame") as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
      {
        action: "fastforward",
      },
      "*",
    );
  };

  const Turn = () => {
    const chess = new Chess();
    chess.loadPgn(pgnString);
    const color = whitePlayer === YOU.value ? "w" : "b";
    return chess.turn() === color ? "Your turn" : <>Opponent&apos;s turn</>;
  };

  return (
    <>
      {!!checkmate && <CheckmateModal pgnString={pgnString} />}
      <div className="my-8">
        <h1 className="md:text-5xl my-8 text-center font-pistilli text-4xl font-bold">
          Here&apos;s the chess game
          <br />
          <span className="bg-gradient-to-br from-blue-300 to-blue-500 bg-clip-text text-transparent">
            <Turn />
          </span>
        </h1>
      </div>
      <div className="flex w-full flex-col items-center gap-4">
        {!!showPlayerModal && <PlayerModal id={game.id} />}
        <div className="flex flex-col">
          <div className="relative">
            <iframe
              id="chessGame"
              onLoad={() => {
                setTimeout(() => {
                  const iframe = document.getElementById(
                    "chessGame",
                  ) as HTMLIFrameElement;
                  iframe.contentWindow?.postMessage(
                    {
                      action: "launch",
                      userPick: whitePlayer === YOU.value ? "w" : "b",
                      id: game.id,
                      type: game.type,
                      pgnString: pgnString,
                    },
                    "*",
                  );
                }, 500);
              }}
              src={process.env.NEXT_PUBLIC_CHESS_PAGE}
              className="rounded-t-lg"
              width={"386"}
              height={"408"}
            />
            {showCountdown && (
              <Countdown done={() => setShowCountdown(false)} />
            )}
            {showMoves && <Moves pgnString={pgnString} />}
          </div>

          <div
            className={`${game.type === GameType.Remote ? "flex  w-full justify-end" : "grid grid-cols-5"}  w-full rounded-b-lg bg-gray-800`}
          >
            {game.type !== GameType.Remote && (
              <>
                <a
                  onClick={rewindGame}
                  id="chess-rewind"
                  className="center flex h-[42px] flex-1 cursor-pointer items-center justify-center"
                >
                  <RewindIcon />
                </a>
                <a
                  onClick={undoMove}
                  id="chess-previous"
                  className="center flex h-[42px] flex-1 cursor-pointer items-center justify-center"
                >
                  <PreviousIcon />
                </a>
                <a
                  onClick={redoMove}
                  id="chess-next"
                  className="center flex h-[42px] flex-[0.25] cursor-pointer items-center justify-center"
                >
                  <NextIcon />
                </a>
                <a
                  onClick={fastForward}
                  id="chess-fast-forward"
                  className="center flex h-[42px] flex-[0.25] cursor-pointer items-center justify-center"
                >
                  <FastForwardIcon />
                </a>
              </>
            )}

            <a
              id="chess-fast-forward"
              onClick={() => setShowMoves(!showMoves)}
              className="center flex h-[42px] cursor-pointer items-center justify-center px-4"
            >
              <Menu />
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate.push("/")}
            className="btn btn-primary font-pistilli text-sm uppercase text-white/75 "
          >
            Go Home
          </button>
          {/* <button
            onClick={resetGame}
            className="btn btn-primary font-pistilli text-sm uppercase text-white/75 "
          >
            RESET
          </button> */}
        </div>
      </div>
    </>
  );
};

export default SavedGame;
