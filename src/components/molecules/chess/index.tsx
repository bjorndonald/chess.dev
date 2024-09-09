"use client";
import React, { useEffect, useState } from "react";
import RewindIcon from "./Rewind.icon";
import PreviousIcon from "./Previous.icon";
import NextIcon from "./Next.icon";
import FastForwardIcon from "./FastForward.icon";
import { Menu } from "react-feather";
import { Chess } from "chess.js";
import Moves from "./Moves";
import Countdown from "./Countdown";
import { CHESS_GAME_PGN_STATE } from "@/constants/strings";
import { createGame } from "@/actions/game";
import Game from "@/types/game";
import useGame from "@/store/game";
import toast from "react-hot-toast";
import ShareModal from "@/components/ui/share";
import CheckmateModal from "@/components/ui/checkmate";
import Select from "@/components/atoms/select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Track from "./Track";
import { AxiosError } from "axios";
import { Claude3Dot5Sonnet, GPT3Dot5Turbo, GPT4oMini, STOCKFISH, YOU } from "./strings";

const GameType = {
  Local: "Local",
  Computer: "Computer",
};


const playerList = [YOU, GPT3Dot5Turbo, GPT4oMini, STOCKFISH];

const ChessGame = ({ initialGame }: { initialGame: Game }) => {
  const session = useSession();
  const navigate = useRouter();
  const [checkmate, setCheckmate] = useState(false);
  const [showMoves, setShowMoves] = useState(false);
  const [pgnString, setPgnString] = useState(initialGame.pgnstring);

  const shareModal = useGame(s => s.shareModal);
  const [game, setGame] = useState<Game>(initialGame);
  const [showCountdown, setShowCountdown] = useState(false);
  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");

  const startGame = async e => {
    e.preventDefault();
    try {
      const gameType =
        whitePlayer != YOU.value || blackPlayer != YOU.value
          ? GameType.Computer
          : GameType.Local;
      const game = await createGame(
        {
          pgnString: new Chess().pgn(),
          type: gameType,
          owner: session.data.user.email,
        } as unknown as Game,
        whitePlayer.toLowerCase(),
        blackPlayer.toLowerCase(),
      );

      setGame(game);
      setShowCountdown(true);

      setTimeout(() => {
        window.location.href = `${window.location.href.replace("game", "")}/game/${game.id}`;
        // navigate.replace(`/game/${game.id}`)
      }, 3000);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response.status === 401) {
          toast.error("Game limit has been reached.");
        } else toast.error("Network Error");
      }
    }
  };

  const saveGame = async () => {
  };

  const resetGame = () => {
    // const iframe = document.getElementById("chessGame") as HTMLIFrameElement;
    // iframe.contentWindow?.postMessage(
    //   {
    //     action: "reset",
    //   },
    //   "*",
    // );
    // if (!game) {
    //   // localStorage.removeItem(CHESS_GAME_ID);
    //   // localStorage.removeItem(CHESS_GAME_PGN_STATE);
    // }
    // setPgnString(new Chess().pgn());
    // setGameStart(false);
    navigate.push("/");
  };

  useEffect(() => {
    if (!game.id) {
      const pgn = localStorage.getItem(CHESS_GAME_PGN_STATE) || "";
      setPgnString(pgn);
    }

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
    const chess = new Chess();
    chess.loadPgn(pgnString);

    if (chess.inCheck())
      toast.success(`${chess.turn() === "w" ? "Black" : "White"} is in check`);
    if (chess.isDraw()) toast.success("Game has been drawn");
    if (chess.isCheckmate()) setCheckmate(true);
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
      {!!checkmate && <CheckmateModal pgnString={pgnString} />}
      <Track pgnString={pgnString} game={game} />
      <form
        onSubmit={startGame}
        className="relative z-[100] -mt-80 flex w-full flex-col items-center gap-4"
      >
        <div className="flex flex-col">
          <div className="relative">
            <iframe
              id="chessGame"
              src={process.env.NEXT_PUBLIC_CHESS_PAGE + "/?id=" + game.id || ""}
              className="rounded-t-lg"
              width={"386"}
              height={"708"}
            />
            {showCountdown && (
              <Countdown done={() => setShowCountdown(false)} />
            )}
            {showMoves && <Moves pgnString={pgnString} />}
          </div>

          <div className="bg-gray-800  grid w-full grid-cols-5 rounded-b-lg">
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
        {!!game.id.length && (
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
        {!game.id.length && (
          <>
            <div className="flex w-full items-center gap-4">
              <div className="flex flex-[0.5] flex-col gap-2">
                <small>White</small>
                <Select
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
