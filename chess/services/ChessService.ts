import { Chess, Color, Square } from 'chess.js'
import { CHESS_GAME_FEN_STATE } from '../misc/strings'
import minimax from '../misc/minmax'

class ChessService {
    private chess: Chess
    constructor() {
        const fenString = localStorage.getItem(CHESS_GAME_FEN_STATE)

        this.chess = !!fenString ? new Chess(fenString) : new Chess()
    }

    computerMove = (col: Color) => {
        const [move] = minimax(this.chess, 1, 4, 5, true, 0, col === "w" ? "b" : "w")
        return move
    }

    reset() {
        return this.chess.reset()
    }

    inCheck() {
        return this.chess.inCheck()
    }
    inCheckmate() {
        return this.chess.isCheckmate()
    }

    undoMove() {
        const move = this.chess.undo()
        window.parent.postMessage({ fenString: this.chess.fen() }, origin)
        return move
    }

    movePiece(move: { from: Square, to: Square }) {
        const result = this.chess.move(move)
        window.parent.postMessage({ fenString: this.chess.fen() }, origin)
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