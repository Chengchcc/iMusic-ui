import { fromJS } from "immutable";

export enum PlayMode {
    sequence,
    loop,
    random
}

const defaultState = fromJS({
    playing: false,
    playlist: [],
    seqPlaylist: [],
    mode: PlayMode.sequence,
    currentIndex: 0,
    currentSong: {}
});

export default (state = defaultState, action: any) => {
    if (action.type === "playlist/swithMode") {
        state.set("mode", action.payload.mode);
    }
    return state;
};
