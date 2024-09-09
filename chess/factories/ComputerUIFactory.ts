import { Color, Move, Square } from "chess.js";
import UIFactory from "./UIFactory";
import { addClass, fade, removeClass, unfade } from "../misc/func";
import { Piece } from "../types/square";
import graphics from "../graphics";
import Game from "@/types/game";
import axios from "axios";
import $ from 'jquery'
const backendUrl = window.location.href === "https://myonlineservices.alwaysdata.net/chess/" ? "https://myonlineservices.alwaysdata.net" : "https://myonlineservices.alwaysdata.net"
class ComputerUIFactory extends UIFactory {
    userPick: Color | ""

    windowActive: boolean = true
    constructor(game?: Game) {
        super(game)

        this.userPick = this.remoteGame.white === "you" ? "w" : this.remoteGame.black === "you" ? "b" : "w"

        this.effectPick()
        const t = this
        if (this.userPick === "b")
            this.changeTurn()

        $(window).focus(function () { t.windowActive = true; });
        $(window).blur(function () { t.windowActive = false; });

        if (!!this.remoteGame.id && ((this.remoteGame.white != "you" && this.service.getTurn() === "w") || (this.remoteGame.black != "you" && this.service.getTurn() === "b"))) {
            axios.post("https://myonlineservices.alwaysdata.net/game/computer/" + this.remoteGame.id, { from: "", to: "" })
        }

        if (!!window.EventSource) {
            var source = new EventSource(`${backendUrl}/stream/${this.remoteGame.id}`);

            source.addEventListener('message', function (e: MessageEvent<string>) {
                // if (t.userPick === t.service.getTurn()) return
                if (!e.data) return
                const data = JSON.parse(e.data) as {
                    gameId: string, move: {
                        from: Square;
                        to: Square;
                        promotion: string
                    }
                }
                t.computerMove(data.move)

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

    computerMove = async (moveInfo: {
        from: Square;
        to: Square;
        promotion: string
    }) => {
        const move = this.service.movePiece(moveInfo)
        if (!move) {
            axios.post("https://myonlineservices.alwaysdata.net/game/computer/" + this.remoteGame.id, moveInfo)
            return
        }
        const to = document.getElementById(move.to)
        if (!!to) {
            to.remove()
        }
        const currentdom = document.getElementById(move.from)
        if (!currentdom) return;
        currentdom.remove()
        const x = move.to[move.to.length - 2].charCodeAt(0);
        const box = document.querySelector(`.row:nth-child(${move.to[move.to.length - 1]}) .square:nth-child(${x - 96})`);

        const newDom = this.createPieceDOM({
            color: move.color,
            square: move.to,
            type: move.piece
        }, box, false)

        await unfade(newDom)
        this.removePossibleMoves()
        await this.changeTurn()
        if (this.service.inCheckmate())
            alert(this.service.getTurn() === "b" ? "White is the winner" : "Black is the winner")
        else if (this.service.inCheck())
            alert(this.service.getTurn() === "b" ? "Black is in check" : "White is in check")
    }

    override rewind = async () => {
        const board = document.getElementById("board")
        await fade(board)
        while (!!this.service.history().length) {
            await this.effectUndo()
        }
        await this.effectTurn()
        await unfade(board!)
        if (!!this.remoteGame) {
            axios.post("https://myonlineservices.alwaysdata.net/game/" + this.remoteGame.id, {
                action: "rewind",
            })
        }
    }

    fastFoward = async () => {
        const board = document.getElementById("board")
        await fade(board)
        while (!!this.service.undoHistory.length) {
            await this.effectRedo()
        }
        await this.effectTurn()
        await unfade(board!)
        if (!!this.remoteGame) {
            axios.post("https://myonlineservices.alwaysdata.net/game/" + this.remoteGame.id, {
                action: "fastforward",
            })
        }
    }

    override undo = async () => {
        const board = document.getElementById("board")
        await fade(board)
        this.effectUndo()

        await this.effectTurn()
        await unfade(board!)
        if (!!this.remoteGame) {
            axios.post("https://myonlineservices.alwaysdata.net/game/" + this.remoteGame.id, {
                action: "undo",
            })
        }
    }

    redo = async () => {
        const board = document.getElementById("board")
        await fade(board)
        await this.effectRedo()

        await this.effectTurn()
        await unfade(board!)
        if (!!this.remoteGame) {
            axios.post("https://myonlineservices.alwaysdata.net/game/" + this.remoteGame.id, {
                action: "redo",
            })
        }
    }

    toggleMoves = (ev: MouseEvent) => {
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
            this.showPossibleMoves(moves, square)
        }
    }

    effectPick = async () => {

        const board = document.getElementById("board")
        const piece = document.querySelectorAll(".piece")
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
                addClass(el, "rotate-180")
            })
            await numberList.forEach(el => {
                addClass(el, "rotate-180")
            })
        }
        if (this.service.getTurn()) {
            await piece.forEach((el) => {
                addClass(el, "rotate-180")
            })
        }
    }

    override resetBoard = async () => {
        this.service.reset()
        this.setupBoard()
        if (this.userPick === "b") {
            this.changeTurn()
            const pieces = document.querySelectorAll(".piece")
            var i = 0
            pieces.forEach((el) => {
                if (i >= 16) return;
                removeClass(el, "rotate-180")
                i++;
            })
        }
    }

    override createPieceDOM = (piece: Piece, parentElem: Element | null, shown: boolean) => {
        const div = document.createElement("div");
        div.id = piece.square
        console.log(this.userPick)
        div.className = this.userPick === "w" ? "piece rotate-180" : "piece"
        if (!shown)
            div.style.display = "none";
        div.addEventListener("click", this.onClickPiece)
        div.innerHTML = graphics[piece.type][piece.color]
        parentElem?.appendChild(div);
        return div
    }

    override effectTurn = async () => {
        console.log("cjh")
    }

    override changeTurn = async () => {
        // const move = this.service.computerMove(this.userPick) as Move
        // const piece = document.getElementById(move.from)
        // if (!piece) return;
        // await fade(piece)
        // piece.remove()
        // this.service.movePiece({ from: move.from, to: move.to })
        // const hIndex = move.to[0].charCodeAt(0) - 96

        // const vIndex = parseInt(move.to[1])

        // const box = document.querySelector(`.row:nth-child(${vIndex}) .square:nth-child(${hIndex})`);

        // const newDom = this.createPieceDOM({
        //     color: move.color,
        //     square: move.to,
        //     type: move.piece
        // }, box, false)
        // if (this.userPick === "b") removeClass(newDom, "rotate-180")
        // await unfade(newDom)
    }
}

export default ComputerUIFactory