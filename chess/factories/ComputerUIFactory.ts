import { Color, Move, Square } from "chess.js";
import UIFactory from "./UIFactory";
import { addClass, fade, removeClass, unfade } from "../misc/func";
import { CHESS_GAME_USER_PICK } from "../misc/strings";
import minimax from "../misc/minmax";

class ComputerUIFactory extends UIFactory {
    userPick: Color
    constructor() {
        super()
        const pick = localStorage.getItem(CHESS_GAME_USER_PICK)
        if (!pick) return

        this.userPick = pick as Color
        this.effectPick()
        if (pick === "b")
            this.changeTurn()
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
            this.showPossibleMoves(moves, piece.color)
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
            console.log(this.userPick)
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

    override changeTurn = async () => {
        const move = this.service.computerMove(this.userPick) as Move
        const piece = document.getElementById(move.from)
        if (!piece) return;
        await fade(piece)
        piece.remove()
        this.service.movePiece({ from: move.from, to: move.to })
        const hIndex = move.to[0].charCodeAt(0) - 96

        const vIndex = parseInt(move.to[1])

        const box = document.querySelector(`.row:nth-child(${vIndex}) .square:nth-child(${hIndex})`);

        const newDom = this.createPieceDOM({
            color: move.color,
            square: move.to,
            type: move.piece
        }, box, false)
        if (this.userPick === "b") removeClass(newDom, "rotate-180")
        await unfade(newDom)
    }
}

export default ComputerUIFactory