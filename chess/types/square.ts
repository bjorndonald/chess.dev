export interface Piece {
    color: Color
    type: Type
    square: Square
}

type Vertical = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type Horizontal = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'

export type Square = `${Horizontal}${Vertical}`

export type Color = "w" | "b"

export type Type = "p" | "r" | "n" | "b" | "q" | "k"