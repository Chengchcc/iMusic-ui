import { fromJS } from "immutable";
import { search } from "../services/search";

const defaultState = fromJS({
    isLoading: false,
    songs: [],
    albums: [],
    artists: [],
    playlists: [],
    songsCurrentPage: 0,
    songsTotalPage: 0,
    albumsCurrentPage: 0,
    albumsTotalPage: 0,
    artistsCurrentPage: 0,
    artistsTotalPage: 0,
    playlistsCurrentPage: 0,
    playlistsTotalPage: 0
});

export default (state = defaultState, action: any) => {
    if (action.type === "search/getsongs") {
        search(action.payload.keywords, "songs", action.payload.page);
        return state.set("isLoading", true);
    }
    if (action.type === "search/getalbums") {
        search(action.payload.keywords, "albums", action.payload.page);
        return state.set("isLoading", true);
    }
    if (action.type === "search/getartists") {
        search(action.payload.keywords, "artists", action.payload.page);
        return state.set("isLoading", true);
    }
    if (action.type === "search/getplaylists") {
        search(action.payload.keywords, "playlists", action.payload.page);
        return state.set("isLoading", true);
    }
    if (action.type === "search/setsongs") {
        return state
            .set("isLoading", false)
            .set("songs", fromJS(action.payload.songs))
            .set("songsCurrentPage", action.payload.songsCurrentPage)
            .set("songsTotalPage", action.payload.songsTotalPage);
    }
    if (action.type === "search/setalbums") {
        return state
            .set("isLoading", false)
            .set("albums", fromJS(action.payload.albums))
            .set("albumsCurrentPage", action.payload.albumsCurrentPage)
            .set("albumsTotalPage", action.payload.albumsTotalPage);
    }
    if (action.type === "search/setartists") {
        return state
            .set("isLoading", false)
            .set("artists", fromJS(action.payload.artists))
            .set("artistsCurrentPage", action.payload.artistsCurrentPage)
            .set("artistsTotalPage", action.payload.artistsTotalPage);
    }
    if (action.type === "search/setplaylists") {
        return state
            .set("isLoading", false)
            .set("playlists", fromJS(action.payload.playlists))
            .set("playlistsCurrentPage", action.payload.playlistsCurrentPage)
            .set("playlistsTotalPage", action.payload.playlistsTotalPage);
    }
    if (action.type === "search/clear") {
        return defaultState;
    }
    return state;
};
