import Game from "@/types/game";
import axios from "axios";
import { Color, Move } from "chess.js";
import toast from "react-hot-toast";

export const createGame = async (game: Game, userPick: Color, opponent: string) => {
    try {
        toast.loading("Loading...", { id: "loading" })
        const res = await axios.post("/api/game", { ...game, userPick, opponent })
        toast.remove("loading")
        toast.success("Game created")
       
        return res.data.game as Game
    } catch (error) {
        toast.remove("loading")
        toast.error("Network Error")
    }
}

export const updateGame = async (id: string, move: Move) => {
    try {
        const res = await axios.put("/api/game/"+id, move)
        const game = res.data.game as Game
        
        if(game.type === "Remote") {
            await axios.post(
                process.env.NEXT_PUBLIC_BACKEND_URL + "/stream/" + id,
                {
                    gameId: id,
                    move,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );
        }
        return game
    } catch (error) {
        //
    }
}

export const getGameById = async (id: string) => {
    const res = await fetch(process.env.NEXTAUTH_URL + "/api/game/" + id)
    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return (await res.json()).game as Game
}