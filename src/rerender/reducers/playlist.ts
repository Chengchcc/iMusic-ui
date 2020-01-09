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
    indexList: [],
    seqPlaylist: [],
    mode: PlayMode.sequence,
    currentIndex: 0,
    currentSong: {
        src:
            "http://m8.music.126.net/20200109195345/0b39da1895a442d818990f43be40694a/ymusic/040e/5153/5208/3dcd1fcd83f9904b7ca6ebbfedf25037.mp3",
        artist: { name: "韩甜甜", id: 32621386 },
        album: { name: "画", id: 82882725 },
        name: "画",
        img1v1Url:
            "https://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg",
        duration: 167520,
        id: 1400261501
    }
});

const changeMode = (state: any, mode: PlayMode) => {
    const seqPlaylist = state.get("seqPlaylist");
    const currentIndex = state.get("currentIndex");
    const len = seqPlaylist.size;
    const indexList = range(0, len);
    switch (mode) {
        case PlayMode.loop:
            indexList.fill(currentIndex);
            break;
        case PlayMode.random:
            shuffle(indexList);
            break;
        default:
    }
    return state.set("indexList", indexList).set("mode", mode);
};

const changeSong = (state: any, next: boolean) => {
    const indexList = state.get("inxdexList");
    const currentIndex = state.get("currentIndex");
    const seqPlaylist = state.get("seqPlayList");
    if (!indexList.size) return;
    let idx =
        (((currentIndex - 1) % indexList.size) + indexList.size) %
        indexList.size;
    if (next) {
        idx = (currentIndex + 1) % indexList.size;
    }
    const index = indexList.get(idx);
    const currentSong = seqPlaylist.get(idx);
    return state.set("currentIndex", index).set("currentSong", currentSong);
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
    return state;
};
