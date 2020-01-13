import axios from "axios";
import { baseApi } from "../util/constant.json";
import store from "../reducers/index";
import { createAction } from "../util/aciton";

const LIMIT = 20;

export const search = async (
    keywords: string,
    searchType: string,
    page: number,
    limit = LIMIT
) => {
    const type = str2SearchType(searchType);
    try {
        const url = `${baseApi}/search?keywords=${keywords}&limit=${limit}&offset=${(page -
            1) *
            limit}&type=${type}`;
        const resp = await axios.get(url);
        const { data } = resp;
        store.dispatch(
            createAction(`search/set${searchType}`)(
                parse(data, searchType, page)
            )
        );
    } catch (err) {
        console.log("serach error=>", err);
        store.dispatch(
            createAction(`search/set${searchType}`)({
                [`${searchType}`]: [],
                [`${searchType}CurrentPage`]: 0,
                [`${searchType}TotalPage`]: 0
            })
        );
    }
};

const str2SearchType = (str: string) => {
    switch (str) {
        case "songs":
            return 1;
        case "albums":
            return 10;
        case "artists":
            return 100;
        case "playlists":
            return 1000;
    }
};

const parse = (data: any, type: string, page: number) => {
    if (data.code !== 200) {
        throw data;
    }
    const list: any[] = [];
    let total = 0;
    if (type === "songs") {
        data.result.songs.map((e: any) => {
            list.push({
                id: e.id.toString(),
                name: e.name,
                duration: e.duration,
                artists: e.artists.map((e2: any) => ({
                    name: e2.name,
                    id: e2.id
                })),
                album: {
                    id: e.album.id,
                    name: e.album.name
                }
            });
        });
        total = data.result.songCount / LIMIT;
    } else if (type === "albums") {
        data.result.albums.map((e: any) => {
            const artist = e.artist;
            list.push({
                id: e.id.toString(),
                name: e.name,
                cover: e.picUrl,
                publish: e.publishTime,
                size: e.size,
                artist: {
                    id: artist.id,
                    name: artist.name,
                    link: `/artist/${artist.id}`
                }
            });
        });
        total = data.result.albumCount / LIMIT;
    } else if (type === "artists") {
        data.result.artists.map((e: any) => {
            list.push({
                id: e.id.toString(),
                name: e.name,
                avatar:
                    e.picUrl ||
                    "http://p3.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=100y100",
                followed: e.followed,
                size: e.albumSize,
                link: `/artist/${e.id}`
            });
        });
        total = data.result.artistCount / LIMIT;
    } else if (type === "playlists") {
        data.result.playlists.map((e: any) => {
            const creator = e.creator;
            list.push({
                id: e.id.toString(),
                name: e.name,
                cover: e.coverImgUrl,
                played: e.playCount,
                star: e.bookCount,
                size: e.trackCount,
                creator: {
                    id: creator.id,
                    name: creator.name,
                    link: `/user/${creator.id}`
                }
            });
        });
        total = data.result.playlistCount / LIMIT;
    }

    const result = {
        [`${type}`]: list,
        [`${type}CurrentPage`]: page,
        [`${type}TotalPage`]: Math.floor(total)
    };
    return result;
};
