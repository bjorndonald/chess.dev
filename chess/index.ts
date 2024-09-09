
import UIFactory from "./factories/UIFactory";
import { Color } from "chess.js";
import ComputerUIFactory from "./factories/ComputerUIFactory";
import { CHESS_GAME_ID, CHESS_GAME_PGN_STATE, CHESS_GAME_TYPE, CHESS_GAME_UNDO_HISTORY, CHESS_GAME_USER_PICK, devUrl, remoteUrl } from "./misc/strings";
import axios from "axios";
import Game from "@/types/game";

let factory: UIFactory

const origin = window.location.href.includes(remoteUrl) ? "https://quickchess.vercel.app" : "http://localhost:3000"
function receiveMessage(e: MessageEvent<{ type: string, id: string, pgnString: string, userPick: Color, action: string }>) {


    if (e.origin !== origin)
        return;

    if (e.data.action === "undo") {
        factory.undo()
    }

    if (e.data.action === "redo") {
        factory.redo()
    }

    if (e.data.action === "fastforward") {
        factory.fastFoward()
    }

    if (e.data.action === "rewind") {
        factory.rewind()
    }

    if (e.data.action === "reset") {
        if (!factory.remoteGame) {
            localStorage.removeItem(CHESS_GAME_UNDO_HISTORY)
            localStorage.removeItem(CHESS_GAME_USER_PICK)
            localStorage.removeItem(CHESS_GAME_ID)
            localStorage.removeItem(CHESS_GAME_TYPE)
            localStorage.removeItem(CHESS_GAME_PGN_STATE)
        }

        factory.resetBoard()

    }
}

const id = window.location.href.replace(remoteUrl + "?id=", "").replace(devUrl + "?id=", "")

if (id != "")
    axios.get("https://myonlineservices.alwaysdata.net/game/" + id)
        .then(res => {
            const game = res.data.game as Game;

            if (game.type == "Local")
                factory = new UIFactory()
            if (game.type == "Computer")
                factory = new ComputerUIFactory(game)
        })
else {
    factory = new UIFactory()
}

window.addEventListener('message', receiveMessage);