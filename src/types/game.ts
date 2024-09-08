export default interface Game {
    id?: string
    type: string
    pgnstring: string
    undohistory: string
    white?: string
    black?: string
    created_at: string
    updated_at: string
}