import { Color } from "chess.js";
import UIFactory from "./UIFactory";
import { CHESS_GAME_ID } from "../misc/strings";


class RemoteFactory extends UIFactory {
    userPick: Color
    constructor(userPick: Color) {
        super()
        this.userPick = userPick
        
        console.log(localStorage.getItem(CHESS_GAME_ID))
        if (!!window.EventSource) {
            const id = localStorage.getItem(CHESS_GAME_ID)

            var source = new EventSource(`${origin}/stream/${id}`);
            const t = this
            source.addEventListener('message', function (e: MessageEvent<string>) {
                console.log(e.data)
            })
        }
    }
}

export default RemoteFactory