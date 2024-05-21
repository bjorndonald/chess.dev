import { BISHOP } from "./bishops";
import { KING } from "./kings";
import { KNIGHT } from "./knights";
import { PAWN } from "./pawns";
import { QUEEN } from "./queens";
import { ROOK } from "./rooks";

const lightColor = "#f4f4f4";
const darkColor = "#34364C";

export default {
    p: {
        w: PAWN(lightColor, darkColor),
        b: PAWN(darkColor, lightColor)
    },
    b: {
        w: BISHOP(lightColor, darkColor),
        b: BISHOP(darkColor, lightColor)
    },
    k: {
        w: KING(lightColor, darkColor),
        b: KING(darkColor, lightColor)
    },
    n: {
        w: KNIGHT(lightColor, darkColor),
        b: KNIGHT(darkColor, lightColor)
    },
    q: {
        w: QUEEN(lightColor, darkColor),
        b: QUEEN(darkColor, lightColor)
    },
    r: {
        w: ROOK(lightColor, darkColor),
        b: ROOK(darkColor, lightColor)
    },
}