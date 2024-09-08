import Game from "@/types/game";
import axios from "axios";
import toast from "react-hot-toast";

export const createGame = async (game: Game, white: string, black: string,) => {
    try {
        toast.loading("Loading...", { id: "loading" })
        const res = await axios.post("/api/game", { ...game, white, black })
        toast.remove("loading")
        toast.success("Game created")

        return res.data.game as Game
    } catch (error) {
        toast.remove("loading")

        throw error
    }
}

export const getGames = async (owner: string, sortBy: string, filter: string) => {
    const res = await fetch(process.env.NEXTAUTH_URL + "/api/search/", {
        method: "POST",
        body: JSON.stringify({ owner, sortBy, filter }),
        headers: {
            "Content-Type": "application/json",
        }
    })
    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return (await res.json()).games as Game[]
}

export const updateGame = async (game: Game) => {
    try {
        const res = await axios.put("/api/game/" + game.id, game)
        const newgame = res.data.game as Game
        return newgame
    } catch (error) {
        //
    }
}

export const deleteGame = async (gameId: string) => {
    try {
        await axios.delete("/api/game/" + gameId)
        toast.success("Game deleted")
    } catch (error) {
        console.log(error)

    }
}

export const getGameById = async (id: string) => {
    const res = await fetch(process.env.NEXTAUTH_URL + "/api/game/" + id)
    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return (await res.json()).game as Game
}