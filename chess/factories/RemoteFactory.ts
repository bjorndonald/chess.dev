import { Color, Move, Square } from "chess.js";
import UIFactory from "./UIFactory";
import $ from 'jquery'
import { CHESS_GAME_ID, CHESS_GAME_USER_PICK } from "../misc/strings";
import { addClass, hasClass, removeClass } from "../misc/func";

const backendUrl = window.location.href === "https://myonlineservices.alwaysdata.net/chess/" ? "https://myonlineservices.alwaysdata.net" : "http://localhost:8080"
class RemoteFactory extends UIFactory {
    userPick: Color
    windowActive: boolean = true
    constructor() {
        super()
        const pick = localStorage.getItem(CHESS_GAME_USER_PICK)
        if (!pick) return
        const t = this
        this.userPick = pick as Color 
        this.effectPick()

        $(window).focus(function () { t.windowActive = true; });
        $(window).blur(function () { t.windowActive = false; });

        if (!!window.EventSource) {
            const id = localStorage.getItem(CHESS_GAME_ID)
            var source = new EventSource(`${backendUrl}/stream/${id}`);

            source.addEventListener('message', function (e: MessageEvent<string>) {
                if (t.userPick === t.service.getTurn()) return
                
                if (!e.data) return
                const data = JSON.parse(e.data) as { gameId: string, move: Move }
                t.service.movePiece(data.move)

                if (!t.windowActive) {
                    var notification = new Notification("♟ Chess Move", {
                        body: `Its your turn now`,
                        icon: "https://res.cloudinary.com/b-bassey/image/upload/v1720971964/chess/zsdix27ere36kt8r26vv.png"
                    });
                    notification.onclick = () => {
                        notification.close();
                        window.parent.focus();
                    }
                }
            })
        }
    }

    override effectTurn = async () => {
        // Do nothing
    }

    override changeTurn = async () => {
        // Do nothing
    }

    override toggleMoves = (ev: MouseEvent) => {
        if (this.userPick !== this.service.getTurn())
            return
        const elem = ev?.target as Element
        const square = elem.id as Square
        const piece = this.service.getPieceBySquare(square)
        const moves = this.service.getMovesBySquare(square)

        if (!moves.length) return
        if (this.currentSquare === square) {
            this.currentSquare = null
            this.removePossibleMoves()
        } else {
            this.removePossibleMoves()
            this.currentSquare = square
            this.showPossibleMoves(moves, piece.color)
        }
    }

    effectPick = async () => {

        const board = document.getElementById("board")
        const piece = document.querySelectorAll(".piece") as NodeListOf<HTMLDivElement>
        const numbers = document.getElementById("numbers")
        const numberList = document.querySelectorAll("#numbers div")
        if (this.userPick === "b") {
            removeClass(board!, "rotate-180")
            removeClass(numbers!, "rotate-180")
            await piece.forEach(el => {
                removeClass(el, "rotate-180")
            })

            await numberList.forEach(el => {
                removeClass(el, "rotate-180")
            })

        }
        if (this.userPick === "w") {
            addClass(board!, "rotate-180")
            addClass(numbers!, "rotate-180")
            await piece.forEach((el) => {
                el.style.transform = "rotate(180deg)"
            })
            await numberList.forEach(el => {
                addClass(el, "rotate-180")
            })
        }
    }
}

export default RemoteFactory