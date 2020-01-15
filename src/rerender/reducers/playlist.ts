import { fromJS } from "immutable";
import { range, shuffle } from "../util";

export enum PlayMode {
    sequence,
    loop,
    random
}

const defaultState = fromJS({
    playing: false,
    // index list seq: 1,2,3,4; loop: 1,1,1,1; random: 2,3,4,1
    indexlist: [],
    seqPlaylist: [],
    mode: PlayMode.sequence,
    currentIndex: 0,
    currentSong: {}
});
// reducer
const changeMode = (state: any, mode: PlayMode) => {
    const seqPlaylist = state.get("seqPlaylist");
    const currentIndex = state.get("currentIndex");
    const len = seqPlaylist.size;
    const [indexlist, newCurr] = adJustIndexList(len, currentIndex, mode);
    return state.merge({
        indexlist: fromJS(indexlist),
        mode: mode,
        currentIndex: newCurr
    });
};

const changeSong = (state: any, next: boolean) => {
    const indexlist: number[] = state.get("indexlist").toJS();
    const currentIndex = state.get("currentIndex");
    const seqPlaylist: any[] = state.get("seqPlaylist").toJS();
    if (!indexlist.length) return;
    let idx = -1;
    indexlist.forEach((id, index) => {
        if (id === currentIndex) {
            idx = index;
        }
    });
    next ? idx++ : idx--;
    idx = (idx + indexlist.length) % indexlist.length;
    const index = indexlist[idx];
    const currentSong = seqPlaylist[index];
    return state.merge({
        currentIndex: index,
        currentSong: fromJS(currentSong)
    });
};

// add song at the end of the list
const handleAddSong = (state: any, song: any) => {
    const seqPlaylist: any[] = state.get("seqPlaylist").toJS();
    const indexlist: number[] = state.get("indexlist").toJS();
    const currentIndex = indexlist[state.get("currentIndex")];
    const findex = findIndex(song, seqPlaylist);
    // if is current song doing nothing
    if (findex > -1) return state;
    seqPlaylist.push(song);
    const newCurrIndex = currentIndex === -1 ? 0 : currentIndex;
    const mode = state.get("mode");
    const [indexlist_, newCurr] = adJustIndexList(
        seqPlaylist.length,
        newCurrIndex,
        mode
    );
    return state.merge({
        seqPlaylist: fromJS(seqPlaylist),
        currentIndex: newCurr,
        indexlist: fromJS(indexlist_)
    });
};

// play song, exsit-> go to; not exist -> insert
const handlePlaySong = (state: any, song: any) => {
    const seqPlaylist: any[] = state.get("seqPlaylist").toJS();
    const indexlist: number[] = state.get("indexlist").toJS();
    const findex = findIndex(song, seqPlaylist);
    if (findex > -1) {
        // exsit
        const newSong = seqPlaylist[findex];
        return state.merge({
            currentIndex: findex,
            currentSong: fromJS(newSong)
        });
    }
    const currentIndex = indexlist[state.get("currentIndex")];
    // insert
    const newCurrIndex = (currentIndex + 1) % (seqPlaylist.length + 1);
    seqPlaylist.splice(newCurrIndex, 0, song);
    // adjust indexlist
    const mode = state.get("mode");
    const [indexlist_, newCurr] = adJustIndexList(
        seqPlaylist.length,
        newCurrIndex,
        mode
    );
    return state.merge({
        indexlist: fromJS(indexlist_),
        currentIndex: newCurr,
        seqPlaylist: fromJS(seqPlaylist),
        currentSong: fromJS(song),
        playing: true
    });
};

// delete song
const handleDeleteSong = (state: any, song: any) => {
    const seqPlaylist: any[] = state.get("seqPlaylist").toJS();
    const indexlist: number[] = state.get("indexlist").toJS();
    const findex = findIndex(song, seqPlaylist);
    if (findex === -1) return state;
    const currentIndex = indexlist[state.get("currentIndex")];
    seqPlaylist.splice(findex, 1);
    const newCurrIndex =
        currentIndex === findex
            ? (currentIndex + 1) % seqPlaylist.length
            : currentIndex;
    // adjust indexlist
    const mode = state.get("mode");
    const [indexlist_, newCurr_] = adJustIndexList(
        seqPlaylist.length,
        newCurrIndex,
        mode
    );
    const newCurrSong = seqPlaylist[newCurrIndex];
    return state.merge({
        indexlist: fromJS(indexlist_),
        currentIndex: newCurr_,
        seqPlaylist: fromJS(seqPlaylist),
        currentSong: fromJS(newCurrSong)
    });
};

export default (state = defaultState, action: any) => {
    if (action.type === "playlist/swithMode") {
        return changeMode(state, action.payload.mode);
    }
    if (action.type === "playlist/playSong") {
        return state.set("playing", action.payload.flag);
    }
    if (action.type === "playlist/previous") {
        return changeSong(state, false);
    }
    if (action.type === "playlist/next") {
        return changeSong(state, true);
    }
    if (action.type === "playlist/add") {
        return handleAddSong(state, action.payload.song);
    }
    if (action.type === "playlist/play") {
        return handlePlaySong(state, action.payload.song);
    }
    if (action.type === "playlist/delete") {
        return handleDeleteSong(state, action.payload.song);
    }
    return state;
};

// utils
const findIndex = <T extends { id: number }>(song: T, songList: T[]) => {
    let idx = -1;
    songList.forEach((s, i) => {
        if (s.id === song.id) {
            idx = i;
        }
    });
    return idx;
};

const adJustIndexList = (len: number, currentIndex: number, mode: PlayMode) => {
    const indexlist = range(0, len);
    let currentIndex_ = currentIndex;
    if (mode === PlayMode.loop) {
        indexlist.fill(currentIndex);
    } else if (mode === PlayMode.random) {
        shuffle(indexlist);
        indexlist.forEach((e, idx) => {
            if (currentIndex == e) currentIndex_ = idx;
        });
    }
    return [indexlist, currentIndex_];
};
