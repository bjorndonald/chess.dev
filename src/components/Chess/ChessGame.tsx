"use client";
import React, { useEffect, useState } from "react";
import Select from "../Shared/Select";
import RewindIcon from "./Rewind.icon";
import PreviousIcon from "./Previous.icon";
import NextIcon from "./Next.icon";
import FastForwardIcon from "./FastForward.icon";
import { Menu } from "react-feather";
import { Chess } from "chess.js";
import Moves from "./Moves";
import Countdown from "./Countdown";
import {
  CHESS_GAME_FEN_STATE,
  CHESS_GAME_ID,
  CHESS_GAME_TYPE,
  CHESS_GAME_USER_PICK,
} from "@/constants/strings";

const GameType = {
  Local: "Local",
  Computer: "Computer",
  Remote: "Remote",
}

const YOU = { value: "You" };
const COMPUTER = { value: "Computer" };
const PERSON = { value: "Enter Email", input: true };

const playerList = [YOU, COMPUTER];

const ChessGame = () => {
  const [showMoves, setShowMoves] = useState(false);
  const [fenString, setFenString] = useState(new Chess().fen());
  const [gameStart, setGameStart] = useState(false);
  const [moves, setMoves] = useState<string[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");

  const startGame = () => {
    const bool =
      (whitePlayer === COMPUTER.value && blackPlayer === YOU.value) ||
      (whitePlayer === YOU.value && blackPlayer === COMPUTER.value) ||
      (whitePlayer === PERSON.value && blackPlayer === YOU.value) ||
      (whitePlayer === YOU.value && blackPlayer === PERSON.value);
    if (!bool) return;
    const iframe = document.getElementById("chessGame") as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
      {
        action: "launch",
        userPick: whitePlayer === YOU.value ? "w" : "b",
        id: "empty",
        type:
          whitePlayer === COMPUTER.value || blackPlayer === COMPUTER.value
            ? GameType.Computer
            : GameType.Remote,
        fenString: "",
      },
      "*",
    );
    localStorage.setItem(CHESS_GAME_ID, "empty");
    localStorage.setItem(
      CHESS_GAME_USER_PICK,
      whitePlayer === YOU.value ? "w" : "b",
    );
    localStorage.setItem(CHESS_GAME_FEN_STATE, new Chess().fen());
    localStorage.setItem(
      CHESS_GAME_TYPE,
      whitePlayer === COMPUTER.value || blackPlayer === COMPUTER.value
        ? GameType.Computer
        : GameType.Remote,
    );
    setFenString(new Chess().fen());
    setShowCountdown(true);
    setGameStart(true);
  };

  const resetGame = () => {
    const iframe = document.getElementById("chessGame") as HTMLIFrameElement;
    iframe.contentWindow?.postMessage(
      {
        action: "reset",
      },
      "*",
    );

    localStorage.removeItem(CHESS_GAME_USER_PICK);
    localStorage.removeItem(CHESS_GAME_ID);
    localStorage.removeItem(CHESS_GAME_TYPE);
    localStorage.removeItem(CHESS_GAME_FEN_STATE);
    setFenString(new Chess().fen());
    setMoves([]);
    setGameStart(false);
  };

  useEffect(() => {
    fenString;
    window.addEventListener("message", handleEvent, false);

    return () => {
      window.removeEventListener("message", handleEvent, false);
    };
  }, []);

  const handleEvent = (
    e: MessageEvent<{ fenString: string; moves: string[] }>,
  ) => {
    if (
      !process.env.NEXTAUTH_URL?.includes(e.origin) &&
      e.origin !== process.env.NEXT_PUBLIC_CHESS_PAGE
    ) {
      return;
    }
    setMoves(e.data.moves);
    setFenString(e.data.fenString);
    localStorage.setItem(CHESS_GAME_FEN_STATE, e.data.fenString);
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

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex flex-col">
        <div className="relative">
          <iframe
            onLoad={() => {
              const fenString =
                localStorage.getItem(CHESS_GAME_FEN_STATE) || "";
              if (fenString?.length) {
                setFenString(fenString);
                const userPick =
                  localStorage.getItem(CHESS_GAME_USER_PICK) || "";
                const id = localStorage.getItem(CHESS_GAME_ID) || "";
                const type = localStorage.getItem(CHESS_GAME_TYPE) || "";
                const iframe = document.getElementById(
                  "chessGame",
                ) as HTMLIFrameElement;
                iframe.contentWindow?.postMessage(
                  {
                    action: "launch",
                    userPick,
                    id,
                    type,
                    fenString,
                  },
                  "*",
                );
                if (type != "") {
                  setShowCountdown(true);
                  setGameStart(true);
                }
              }
            }}
            id="chessGame"
            src="http://localhost:5500"
            className="rounded-t-lg"
            width={"386"}
            height={"408"}
          />
          {showCountdown && <Countdown done={() => setShowCountdown(false)} />}
          {showMoves && <Moves moves={moves} />}
        </div>

        <div className="grid  w-full grid-cols-5 rounded-b-lg bg-gray-800">
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
          <a
            id="chess-fast-forward"
            onClick={() => setShowMoves(!showMoves)}
            className="center flex h-[42px] flex-1 cursor-pointer items-center justify-center"
          >
            <Menu />
          </a>
        </div>
      </div>
      {!!gameStart && (
        <>
          <button
            onClick={resetGame}
            className="btn btn-primary font-pistilli text-sm uppercase text-white/75 "
          >
            RESET
          </button>
        </>
      )}
      {!gameStart && (
        <>
          <div className="flex w-full items-center gap-4">
            <div className="flex flex-[0.5] flex-col gap-2">
              <small>White</small>
              <Select
                list={playerList}
                onChange={str => {
                  if (str === YOU.value) {
                    setBlackPlayer(COMPUTER.value);
                  } else if (str === COMPUTER.value) {
                    setBlackPlayer(YOU.value);
                  }
                }}
                placeholder="White player"
              />
            </div>
            <div className="divider divider-horizontal pt-8 text-xs">VS</div>
            <div className="flex flex-[0.5] flex-col gap-2">
              <small>Black</small>
              <Select
                list={playerList}
                onChange={str => {
                  if (str === YOU.value) {
                    setWhitePlayer(COMPUTER.value);
                  } else if (str === COMPUTER.value) {
                    setWhitePlayer(YOU.value);
                  }
                }}
                placeholder="Black player"
              />
            </div>
          </div>
          <button
            onClick={startGame}
            className="btn btn-primary btn-block font-pistilli text-sm uppercase text-white/75 "
          >
            START
          </button>
        </>
      )}
    </div>
  );
};

export default ChessGame;
