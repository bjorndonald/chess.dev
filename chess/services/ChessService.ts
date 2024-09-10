import { Chess, Color, Move, Square } from 'chess.js'
import { CHESS_GAME_PGN_STATE, CHESS_GAME_UNDO_HISTORY } from '../misc/strings'
import minimax from '../misc/minmax'
import Game from '@/types/game'
import axios from 'axios'
const origin = window.location.href.includes("https://myonlineservices.alwaysdata.net/chess/") ? "https://quickchess.vercel.app" : "http://localhost:3000"
class ChessService {
    private chess: Chess
    remoteGame?: Game
    undoHistory: Move[] = []
    constructor(game?: Game) {
        this.remoteGame = game
        const pgnString = !!game ? game.pgnstring : localStorage.getItem(CHESS_GAME_PGN_STATE)

        const chess = new Chess()
        if (!!pgnString)
            chess.loadPgn(pgnString)
        this.chess = chess
        const undoHistory = !!game ? game?.undohistory : localStorage.getItem(CHESS_GAME_UNDO_HISTORY)
        if (!!undoHistory) {
            try {
                this.undoHistory = JSON.parse(undoHistory)
            } catch (error) {
                this.undoHistory = []
            }
        }

    }

    saveToStore() {
        if (!this.remoteGame) {
            localStorage.setItem(CHESS_GAME_PGN_STATE, this.chess.pgn())
            localStorage.setItem(CHESS_GAME_UNDO_HISTORY, JSON.stringify(this.undoHistory))
        }
    }

    computerMove = (col: Color | "") => {
        const [move] = minimax(this.chess, 1, 4, 5, true, 0, col === "w" ? "b" : "w")
        return move
    }

    reset() {
        return this.chess.reset()
    }

    history() {
        return this.chess.history()
    }

    redo() {
        const move = this.undoHistory.pop()
        if (!!move) {
            this.chess.move(move)
            window.parent.postMessage({ pgnString: this.chess.pgn(), move: move }, origin)
        }
        this.saveToStore()
        return move
    }

    inCheck() {
        return this.chess.inCheck()
    }

    inCheckmate() {
        return this.chess.isCheckmate()
    }

    undoMove() {
        const move = this.chess.undo()
        this.undoHistory.push(move)
        window.parent.postMessage({ pgnString: this.chess.pgn(), move: move }, origin)
        this.saveToStore()
        return move
    }

    movePiece(move: { from: Square, to: Square, promotion?: string } | string) {
        try {
            const result = this.chess.move(move)

            window.parent.postMessage({ pgnString: this.chess.pgn(), move: move }, origin)
            this.undoHistory = []

            this.saveToStore()
            if (!!this.remoteGame) {
                axios.post("https://myonlineservices.alwaysdata.net/game/" + this.remoteGame.id, {
                    action: "move",
                    move: result
                })
            }
            if (this.chess.isCheckmate()) {
                axios.post("https://myonlineservices.alwaysdata.net/game/winner/" + this.remoteGame.id, {
                    winner: this.chess.turn() === "w" ? "b" : "w"
                })
            }
            if (this.chess.isStalemate()) {
                axios.post("https://myonlineservices.alwaysdata.net/game/winner/" + this.remoteGame.id, {
                    winner: "draw"
                })
            }
            return result
        } catch (error) {
            return null
        }
    }

    isGameOn() {
        return !this.chess.isGameOver()
    }

    getTurn() {
        return this.chess.turn()
    }

    isDraw() {
        return this.chess.isDraw()
    }

    getPieces() {
        return this.chess.board()
    }

    getPieceBySquare(square: Square) {
        return this.chess.get(square)
    }

    getMovesBySquare(square: Square) {
        return this.chess.moves({ square })
    }
}

export default ChessService