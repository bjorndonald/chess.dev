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
  CHESS_GAME_ID,
  CHESS_GAME_PGN_STATE,
  CHESS_GAME_TYPE,
  CHESS_GAME_USER_PICK,
} from "@/constants/strings";
import { createGame } from "@/actions/game";
import Game from "@/types/game";
import useGame from "@/store/game";
import ShareModal from "../Shared/ShareModal";
import toast from "react-hot-toast";

const GameType = {
  Local: "Local",
  Computer: "Computer",
  Remote: "Remote",
};

const YOU = { value: "You" };
const COMPUTER = { value: "Computer" };
const PERSON = { value: "Enter Email", input: true };

const playerList = [YOU, COMPUTER, PERSON];

const ChessGame = () => {
  const [showMoves, setShowMoves] = useState(false);
  const [pgnString, setPgnString] = useState(new Chess().pgn());
  const [gameStart, setGameStart] = useState(false);
  const shareModal = useGame(s => s.shareModal);
  const showShareModal = useGame(s => s.showShareModal);
  const [showCountdown, setShowCountdown] = useState(false);
  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");
  const [email, setEmail] = useState("");

  const startGame = e => {
    e.preventDefault();
    if (whitePlayer === PERSON.value || blackPlayer === PERSON.value) {
      localStorage.setItem(
        CHESS_GAME_TYPE,
        whitePlayer === COMPUTER.value || blackPlayer === COMPUTER.value
          ? GameType.Computer
          : GameType.Remote,
      );
      saveGame();
      return;
    }
    const bool =
      (whitePlayer === COMPUTER.value && blackPlayer === YOU.value) ||
      (whitePlayer === YOU.value && blackPlayer === COMPUTER.value) ||
      (whitePlayer === PERSON.value && blackPlayer === YOU.value) ||
      (whitePlayer === YOU.value && blackPlayer === PERSON.value);

    if (!bool) {
      toast.error("Invalid inputs");
      return;
    }
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
    localStorage.setItem(CHESS_GAME_PGN_STATE, new Chess().fen());
    localStorage.setItem(
      CHESS_GAME_TYPE,
      whitePlayer === COMPUTER.value || blackPlayer === COMPUTER.value
        ? GameType.Computer
        : GameType.Remote,
    );
    setPgnString(new Chess().pgn());
    setShowCountdown(true);
    setGameStart(true);
  };

  const saveGame = async () => {
    const gameType = localStorage.getItem(CHESS_GAME_TYPE)
      ? localStorage.getItem(CHESS_GAME_TYPE)
      : GameType.Local;
    const game = await createGame(
      {
        pgnString: new Chess().pgn(),
        type: gameType,
      } as unknown as Game,
      whitePlayer === YOU.value ? "w" : "b",
      email,
    );

    showShareModal(game);
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
    localStorage.removeItem(CHESS_GAME_PGN_STATE);
    setPgnString(new Chess().pgn());
    setGameStart(false);
  };

  useEffect(() => {
    const pgn = localStorage.getItem(CHESS_GAME_PGN_STATE) || "";
    setPgnString(pgn);
    window.addEventListener("message", handleEvent, false);

    return () => {
      window.removeEventListener("message", handleEvent, false);
    };
  }, []);

  const handleEvent = (e: MessageEvent<{ pgnString: string }>) => {
    if (
      !process.env.NEXTAUTH_URL?.includes(e.origin) &&
      e.origin !== process.env.NEXT_PUBLIC_CHESS_PAGE
    ) {
      return;
    }
    setPgnString(e.data.pgnString);
    localStorage.setItem(CHESS_GAME_PGN_STATE, e.data.pgnString);
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
    <>
      {!!shareModal && <ShareModal />}

      <form
        onSubmit={startGame}
        className="flex w-full flex-col items-center gap-4"
      >
        <div className="flex flex-col">
          <div className="relative">
            <iframe
              onLoad={() => {
                const pgnString =
                  localStorage.getItem(CHESS_GAME_PGN_STATE) || "";
                if (pgnString?.length) {
                  setPgnString(pgnString);
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
                      pgnString,
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
          <div className="flex justify-center gap-4">
            <button
              onClick={saveGame}
              className="btn btn-primary font-pistilli text-sm uppercase text-white/75 "
            >
              SAVE
            </button>
            <button
              onClick={resetGame}
              className="btn btn-primary font-pistilli text-sm uppercase text-white/75 "
            >
              RESET
            </button>
          </div>
        )}
        {!gameStart && (
          <>
            <div className="flex w-full items-center gap-4">
              <div className="flex flex-[0.5] flex-col gap-2">
                <small>White</small>
                <Select
                  onTextChange={str => setEmail(str)}
                  list={playerList}
                  onChange={str => {
                    setWhitePlayer(str);
                  }}
                  placeholder="White player"
                />
              </div>
              <div className="divider divider-horizontal pt-8 text-xs">VS</div>
              <div className="flex flex-[0.5] flex-col gap-2">
                <small>Black</small>
                <Select
                  onTextChange={str => setEmail(str)}
                  list={playerList}
                  onChange={str => {
                    setBlackPlayer(str);
                  }}
                  placeholder="Black player"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block font-pistilli text-sm uppercase text-white/75 "
            >
              START
            </button>
          </>
        )}
      </form>
    </>
  );
};

export default ChessGame;
