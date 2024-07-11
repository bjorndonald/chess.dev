import Game from "@/types/game";
import { create } from "zustand";

interface IGameState {
    shareModal: Game | undefined
    showShareModal: (id: Game) => void
}
const useGame = create<IGameState>((set) => ({
    shareModal: undefined,
    showShareModal(id) {
        set({
            shareModal: id
        })
    },
}));

export default useGame;