
import UIFactory from "./factories/UIFactory";
import { Color } from "chess.js";
import ComputerUIFactory from "./factories/ComputerUIFactory";
import { CHESS_GAME_ID, CHESS_GAME_PGN_STATE, CHESS_GAME_TYPE, CHESS_GAME_UNDO_HISTORY, CHESS_GAME_USER_PICK } from "./misc/strings";
import RemoteFactory from "./factories/RemoteFactory";
const GameType = {
    Local: "Local",
    Computer: "Computer",
    Remote: "Remote",
}
let factory: UIFactory
function receiveMessage(e: MessageEvent<{ type: string, id: string, pgnString: string, userPick: Color, action: string }>) {
    
     const origin = window.location.href === "https://myonlineservices.alwaysdata.net/chess/" ? "https://quickchess.vercel.app" : "http://localhost:3000"
 
    if (e.origin !== origin)
        return;
    if (e.data.action === "launch") {
        
        localStorage.setItem(CHESS_GAME_USER_PICK, e.data.userPick)
        localStorage.setItem(CHESS_GAME_ID, e.data.id)
        localStorage.setItem(CHESS_GAME_TYPE, e.data.type)
        localStorage.removeItem(CHESS_GAME_UNDO_HISTORY)
        localStorage.setItem(CHESS_GAME_PGN_STATE, e.data.pgnString)
        if (e.data.type === GameType.Computer)
            factory = new ComputerUIFactory()
        if (e.data.type === GameType.Remote)
            factory = new RemoteFactory()
        else factory = new UIFactory()
    }

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
        localStorage.removeItem(CHESS_GAME_UNDO_HISTORY)
        localStorage.removeItem(CHESS_GAME_USER_PICK)
        localStorage.removeItem(CHESS_GAME_ID)
        localStorage.removeItem(CHESS_GAME_TYPE)
        localStorage.removeItem(CHESS_GAME_PGN_STATE)
        factory.resetBoard()
        factory = new UIFactory()
    }
}
factory = new UIFactory()
window.addEventListener('message', receiveMessage);
