import GameType from "@/types/gametype";
import UIFactory from "./factories/UIFactory";
import { Color } from "chess.js";
import { CHESS_GAME_FEN_STATE, CHESS_GAME_ID, CHESS_GAME_TYPE, CHESS_GAME_USER_PICK } from "./misc/strings";
import ComputerUIFactory from "./factories/ComputerUIFactory";
let factory: UIFactory
function receiveMessage(e: MessageEvent<{ type: GameType, id: string, fenString: string, userPick: Color, action: string }>) {
    const origin = window.location.href === "https://myonlineservices.alwaysdata.net/chess/" ? "https://chess-game-eosin.vercel.app" : "http://localhost:3000"

    if (e.origin !== origin)
        return;
    if (e.data.action === "launch") {
        localStorage.setItem(CHESS_GAME_ID, e.data.id)
        localStorage.setItem(CHESS_GAME_TYPE, e.data.type)
        localStorage.setItem(CHESS_GAME_USER_PICK, e.data.userPick)
        localStorage.setItem(CHESS_GAME_FEN_STATE, e.data.fenString)
        if (e.data.type === GameType.Computer)
            factory = new ComputerUIFactory()
        else factory = new UIFactory()
    }

    if (e.data.action === "reset") {
        factory.resetBoard()
    }
}

window.addEventListener('message', receiveMessage);
factory = new UIFactory()