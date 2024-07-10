import { Chess, Color, Move, Square } from 'chess.js'
import { CHESS_GAME_FEN_STATE } from '../misc/strings'
import minimax from '../misc/minmax'
const origin = window.location.href === "https://myonlineservices.alwaysdata.net/chess/" ? "https://chess-game-eosin.vercel.app" : "http://localhost:3000"
class ChessService {
    private chess: Chess
    moveHistory: Move[] = []
    constructor() {
        const fenString = localStorage.getItem(CHESS_GAME_FEN_STATE)
        this.chess = !!fenString ? new Chess(fenString) : new Chess()
    }

    saveToStore() { 
        localStorage.setItem(CHESS_GAME_FEN_STATE, this.chess.fen())
    }

    computerMove = (col: Color) => {
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
        const move = this.moveHistory.pop()
        if(!!move){
            this.chess.move(move)
            window.parent.postMessage({ fenString: this.chess.fen(), moves: this.chess.history() }, origin)
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
        this.moveHistory.push(move)
        window.parent.postMessage({ fenString: this.chess.fen(), moves: this.chess.history() }, origin)
        this.saveToStore()
        return move
    }

    movePiece(move: { from: Square, to: Square }) {
       const result = this.chess.move(move)
        window.parent.postMessage({ fenString: this.chess.fen(), moves: this.chess.history() }, origin)
        this.saveToStore()
        return result
    }

    isGameOn() {
        return !this.chess.isGameOver()
    }

    getTurn() {
        return this.chess.turn()
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