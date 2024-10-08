import { Chess, Color } from "chess.js";
import evaluateBoard from "./board";

export default function minimax(game: Chess, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean, sum: number, color: Color) {
    var children = game.moves({ verbose: true });

    // Sort moves randomly, so the same move isn't always picked on ties
    children.sort(function (a, b) { return 0.5 - Math.random() });

    var currMove;
    // Maximum depth exceeded or node is a terminal node (no children)
    if (depth === 0 || children.length === 0) {
        return [null, sum]
    }

    // Find maximum/minimum from list of 'children' (possible moves)
    var maxValue = Number.NEGATIVE_INFINITY;
    var minValue = Number.POSITIVE_INFINITY;
    var bestMove;
    for (var i = 0; i < children.length; i++) {
        currMove = children[i];

        // Note: in our case, the 'children' are simply modified game states
        var currPrettyMove = game.move(currMove);
        var newSum = evaluateBoard(currPrettyMove, sum, color);
        var [childBestMove, childValue] = minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer, newSum, color);

        game.undo();

        if (isMaximizingPlayer) {
            if (childValue > maxValue) {
                maxValue = childValue;
                bestMove = currPrettyMove;
            }
            if (childValue > alpha) {
                alpha = childValue;
            }
        }

        else {
            if (childValue < minValue) {
                minValue = childValue;
                bestMove = currPrettyMove;
            }
            if (childValue < beta) {
                beta = childValue;
            }
        }

        // Alpha-beta pruning
        if (alpha >= beta) {
            break;
        }
    }

    if (isMaximizingPlayer) {
        return [bestMove, maxValue]
    }
    else {
        return [bestMove, minValue];
    }
}