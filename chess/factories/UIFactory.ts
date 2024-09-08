import { Square, Color } from "chess.js"
import graphics from "../graphics"
import ChessService from "../services/ChessService"
import { Piece } from "../types/square"
import { addClass, fade, getChildElementIndex, removeClass, unfade } from "../misc/func"
import axios from "axios"
import { devUrl, remoteUrl } from "../misc/strings"
import Game from "@/types/game"

class UIFactory {
    service: ChessService
    remoteGame?: Game
    currentSquare: Square | null = null
    constructor(game?: Game) {
        this.remoteGame = game
        this.service = new ChessService(game)
        this.setupBoard()
        this.effectTurn()

    }

    resetBoard = async () => {
        this.service.reset()
        this.setupBoard()
    }

    rewind = async () => {
        const board = document.getElementById("board")
        await fade(board)
        while (!!this.service.history().length) {
            await this.effectUndo()
        }
        await this.effectTurn()
        await unfade(board!)
    }

    effectUndo = async () => {
        const move = this.service.undoMove()
        if (!move) return
        const piece = document.getElementById(move.to)

        if (!piece) return;

        piece.remove()
        const hIndex = move.from[0].charCodeAt(0) - 96
        const vIndex = parseInt(move.from[1])
        const box = document.querySelector(`.row:nth-child(${vIndex}) .square:nth-child(${hIndex})`);
        const newDom = this.createPieceDOM({
            color: move.color,
            square: move.from,
            type: move.piece
        }, box, false)
        await unfade(newDom)

    }

    undo = async () => {
        const board = document.getElementById("board")
        await fade(board)
        this.effectUndo()
        await this.effectTurn()
        await unfade(board!)
    }

    effectRedo = async () => {
        const move = this.service.redo()
        if (!move) return
        const piece = document.getElementById(move.from)
        if (!piece) return;
        piece.remove()

        const hIndex = move.to[0].charCodeAt(0) - 96

        const vIndex = parseInt(move.to[1])

        const box = document.querySelector(`.row:nth-child(${vIndex}) .square:nth-child(${hIndex})`);
        const newDom = this.createPieceDOM({
            color: move.color,
            square: move.to,
            type: move.piece
        }, box, false)

        await unfade(newDom)
    }

    redo = async () => {
        const board = document.getElementById("board")
        await fade(board)
        await this.effectRedo()
        await this.effectTurn()
        await unfade(board!)
    }

    fastFoward = async () => {
        const board = document.getElementById("board")
        await fade(board)
        while (!!this.service.undoHistory.length) {
            await this.effectRedo()
        }
        await this.effectTurn()
        await unfade(board!)
    }

    changeTurn = async () => {
        const board = document.getElementById("board")
        await fade(board)
        await this.effectTurn()
        await unfade(board!)
    }

    effectTurn = async () => {
        const turn = this.service.getTurn()
        const board = document.getElementById("board")
        const piece = document.querySelectorAll(".piece")
        const numbers = document.getElementById("numbers")
        const numberList = document.querySelectorAll("#numbers div")
        if (turn === "b") {
            removeClass(board!, "rotate-180")
            removeClass(numbers!, "rotate-180")
            await numberList.forEach(el => {
                removeClass(el, "rotate-180")
            })
            await piece.forEach(el => {
                removeClass(el, "rotate-180")
            })
        }
        if (turn === "w") {
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

    refreshBoard = () => {
        const pieces = document.querySelectorAll('.piece')
        pieces.forEach(x => {
            x.remove()
        })
    }

    setupBoard = () => {
        this.refreshBoard()
        this.service.getPieces().map((row, y) => {
            row.map((piece, x) => {
                const box = document.querySelector(`.row:nth-child(${8 - y}) .square:nth-child(${x + 1})`);

                if (!piece) return
                this.createPieceDOM(piece, box, true)
            })
        })
    }

    createPieceDOM = (piece: Piece, parentElem: Element | null, shown: boolean) => {
        const div = document.createElement("div");
        div.id = piece.square
        const turn = this.service.getTurn()

        div.className = piece.color === "w" ? "piece rotate-180" : "piece"
        if (!shown)
            div.style.display = "none";
        div.addEventListener("click", this.onClickPiece)
        div.innerHTML = graphics[piece.type][piece.color]
        parentElem?.appendChild(div);
        return div
    }

    movePiece = async (ev?: Event) => {
        if (!this.service.isGameOn()) return
        if (!this.currentSquare) return;

        ev?.stopPropagation()
        const elem = ev.target as Element
        const hIndex = getChildElementIndex(elem.parentNode as Element)

        const x = String.fromCharCode(97 + hIndex)
        const vIndex = getChildElementIndex(elem.parentNode.parentElement as Element)
        console.log("move", hIndex, vIndex)
        const square = x + (vIndex + 1) as Square
        console.log("move", square, this.currentSquare)
        if (square === this.currentSquare) return
        const move = this.service.movePiece({ from: this.currentSquare, to: square })

        const to = document.getElementById(square)
        if (!!to) {
            to.remove()
        }
        const currentdom = document.getElementById(this.currentSquare)
        if (!currentdom) return;
        currentdom.remove()
        const box = document.querySelector(`.row:nth-child(${vIndex + 1}) .square:nth-child(${hIndex + 1})`);
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

    promotePiece = async (ev: Event, from: Square, to: Square, moveString: string) => {
        if (!this.service.isGameOn()) return
        if (!this.currentSquare) return;
        ev?.stopPropagation()
        const x = to[to.length - 2].charCodeAt(0);
        const box = document.querySelector(`.row:nth-child(${to[to.length - 1]}) .square:nth-child(${x - 96})`);
        const move = this.service.movePiece(moveString)

        const toElem = document.getElementById(to)
        if (!!toElem) {
            toElem.remove()
        }
        const currentdom = document.getElementById(from)
        if (!currentdom) return;
        currentdom.remove()

        const newDom = this.createPieceDOM({
            color: move.color,
            square: move.to,
            type: move.promotion
        }, box, false)

        await unfade(newDom)
        this.removePossibleMoves()
        await this.changeTurn()
        if (this.service.inCheckmate())
            alert(this.service.getTurn() === "b" ? "White is the winner" : "Black is the winner")

        else if (this.service.inCheck())
            alert(this.service.getTurn() === "b" ? "Black is in check" : "White is in check")
    }

    //override
    onClickPiece = (ev: MouseEvent) => {
        this.toggleMoves(ev)
    }

    toggleMoves = (ev: MouseEvent) => {
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

    removePossibleMoves = () => {
        const circle = document.querySelectorAll(".circle, .danger, .danger-inner, .promotion, .invalid")
        circle.forEach(e => e.remove())
    }

    showPossibleMoves = (moves: string[], square: Square) => {
        moves.map((move, index) => {
            console.log(move)
            const kMove = move.replaceAll("x", "")
                .replaceAll("+", "")
                .replaceAll("#", "")

            if (move.includes("=")) {
                const cp = move.split("=")[1]
                const position = move.split("=")[0]
                const x = position[position.length - 2].charCodeAt(0);
                const box = document.querySelector(`.row:nth-child(${position[position.length - 1]}) .square:nth-child(${x - 96})`);
                const promotion = document.createElement("div");
                promotion.innerHTML = graphics[cp[0].toLowerCase()][cp[0] === cp[0].toUpperCase() ? "w" : "b"]
                promotion.className = "promotion"
                promotion.style.transform = `translate(0%, ${position[position.length - 1] === "8" ? 100 * (index + 1) : -100 * (index + 1)}%) ${cp[0] === cp[0].toUpperCase() ? "rotate(180deg)" : ""}`
                box?.appendChild(promotion)
                promotion?.addEventListener("click", (e) => this.promotePiece(e, square, position as Square, move))
                return
            }
            const x = kMove[kMove.length - 2].charCodeAt(0);
            const box = document.querySelector(`.row:nth-child(${kMove[kMove.length - 1]}) .square:nth-child(${x - 96})`);

            if (move.includes("x")) {
                const danger = document.createElement("div");
                danger.className = "danger"
                box?.appendChild(danger)
                danger?.addEventListener("click", this.movePiece)
                const inner = document.createElement("div");
                inner.className = "danger-inner"
                box?.appendChild(inner)
                inner?.addEventListener("click", this.movePiece)
            } else {
                const circle = document.createElement("div");
                circle.className = "circle"
                box?.appendChild(circle)
                circle?.addEventListener("click", this.movePiece)
            }
        })
    }
}

export default UIFactory