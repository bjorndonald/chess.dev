import { Chess, Color, Move, Square } from 'chess.js'
import { CHESS_GAME_PGN_STATE, CHESS_GAME_UNDO_HISTORY } from '../misc/strings'
import minimax from '../misc/minmax'
const origin = window.location.href === "https://myonlineservices.alwaysdata.net/chess/" ? "https://chess-game-eosin.vercel.app" : "http://localhost:3000"
class ChessService {
    private chess: Chess
    undoHistory: Move[] = []
    constructor() {
        const pgnString = localStorage.getItem(CHESS_GAME_PGN_STATE)
        const chess = new Chess()
        if(!!pgnString)
        chess.loadPgn(pgnString)
        this.chess = chess
        const undoHistory = localStorage.getItem(CHESS_GAME_UNDO_HISTORY)
        if(!!undoHistory){
            try {
                this.undoHistory = JSON.parse(undoHistory)
            } catch (error) {
                this.undoHistory = []
            }
        }
    }

    saveToStore() { 
        localStorage.setItem(CHESS_GAME_PGN_STATE, this.chess.pgn())
        localStorage.setItem(CHESS_GAME_UNDO_HISTORY, JSON.stringify(this.undoHistory))
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
        const move = this.undoHistory.pop()
        if(!!move){
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

    movePiece(move: { from: Square, to: Square }) {
       const result = this.chess.move(move)
        window.parent.postMessage({ pgnString: this.chess.pgn(), move: move }, origin)
        this.undoHistory = []
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