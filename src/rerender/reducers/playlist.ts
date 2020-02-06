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
    const idxlist: number[] = state.get("indexlist").toJS();
    const currIdx = state.get("currentIndex");
    const currentIndex = idxlist[currIdx];
    const [indexlist, newCurr] = adJustIndexList(
        currentIndex,
        idxlist.length,
        mode
    );
    return state.merge({
        indexlist: fromJS(indexlist),
        mode: mode,
        currentIndex: newCurr
    });
};

const changeSong = (state: any, next: boolean) => {
    const indexlist: number[] = state.get("indexlist").toJS();
    const currIdx = state.get("currentIndex");
    const seqPlaylist: any[] = state.get("seqPlaylist").toJS();
    if (!indexlist.length) return;
    let idx = currIdx;
    next ? idx++ : idx--;
    idx = (idx + indexlist.length) % indexlist.length;
    const index = indexlist[idx];
    const currentSong = seqPlaylist[index];
    return state.merge({
        currentIndex: idx,
        currentSong: fromJS(currentSong)
    });
};

// add song at the end of the list
const handleAddSong = <T extends { id: number }>(state: any, song: T) => {
    const currIdx = state.get("currentIndex");
    const idxlist = state.get("indexlist").toJS();
    const itemlist = state.get("seqPlaylist").toJS() as T[];
    const mode = state.get("mode");
    const curr = isNaN(idxlist[currIdx]) ? 0 : idxlist[currIdx];
    const fidx = itemlist.findIndex(el => song.id === el.id);
    if (fidx > -1) return state;
    itemlist.push(song);
    const [indexlist, currentIndex] = adJustIndexList(
        curr,
        itemlist.length,
        mode
    );
    return state.merge({
        currentIndex,
        indexlist: fromJS(indexlist),
        seqPlaylist: fromJS(itemlist)
    });
};

// add songs
const handleAddSongs = <T extends { id: number }>(state: any, songs: T[]) => {
    const mode = state.get("mode");
    const [indexlist, currentIndex] = adJustIndexList(0, songs.length, mode);
    return state.merge({
        currentIndex,
        indexlist: fromJS(indexlist),
        seqPlaylist: fromJS(songs),
        currentSong: fromJS(songs[0]),
        playing: true
    });
};

// play song, exsit-> go to; not exist -> insert
const handlePlaySong = <T extends { id: number }>(state: any, song: T) => {
    const currIdx = state.get("currentIndex");
    const idxlist = state.get("indexlist").toJS();
    const itemlist = state.get("seqPlaylist").toJS() as T[];
    const mode = state.get("mode");
    let curr = isNaN(idxlist[currIdx]) ? -1 : idxlist[currIdx];
    const fidx = itemlist.findIndex(el => song.id === el.id);
    if (fidx === curr && fidx !== -1) return state; // is playing
    if (fidx === -1) {
        // not exsit
        curr++;
        itemlist.splice(curr, 0, song);
    } else {
        curr = fidx;
    }
    const [indexlist, currentIndex] = adJustIndexList(
        curr,
        itemlist.length,
        mode
    );
    const currentSong = itemlist[curr];
    return state.merge({
        currentIndex,
        indexlist: fromJS(indexlist),
        seqPlaylist: fromJS(itemlist),
        currentSong: fromJS(currentSong),
        playing: true
    });
};

// delete song
const handleDeleteSong = <T extends { id: number }>(state: any, song: T) => {
    const currIdx = state.get("currentIndex");
    const idxlist = state.get("indexlist").toJS();
    const itemlist = state.get("seqPlaylist").toJS() as T[];
    const mode = state.get("mode");
    const curr = idxlist[currIdx];
    const fidx = itemlist.findIndex(el => song.id === el.id);
    if (fidx === -1) return state; // not exist
    if (fidx === curr) {
        // is playing
        itemlist.splice(curr, 1);
        const currentItem = itemlist[curr];
        const [indexlist, currentIndex] = adJustIndexList(
            curr,
            itemlist.length,
            mode
        );
        return state.merge({
            currentIndex,
            indexlist: fromJS(indexlist),
            seqPlaylist: fromJS(itemlist),
            currentSong: fromJS(currentItem)
        });
    }
    itemlist.splice(fidx, 1);
    const [indexlist, currentIndex] = adJustIndexList(
        curr,
        itemlist.length,
        mode
    );
    return state.merge({
        currentIndex,
        indexlist: fromJS(indexlist),
        seqPlaylist: fromJS(itemlist)
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
    if (action.type === "playlist/playall") {
        return handleAddSongs(state, action.payload.songs);
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

const adJustIndexList = (
    curr: number,
    len: number,
    mode: PlayMode
): [number[], number] => {
    const indexlist = range(0, len);
    switch (mode) {
        case PlayMode.loop:
            return [indexlist.fill(curr), curr];
        case PlayMode.random: {
            shuffle(indexlist);
            const idx = indexlist.findIndex(el => el === curr);
            return [indexlist, idx];
        }
        default:
            return [indexlist, curr];
    }
};
