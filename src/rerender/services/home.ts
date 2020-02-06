import axios from "axios";
import { baseApi } from "../util/constant.json";

export const getHotAlbums = async () => {
    const url = `${baseApi}/top/album?offset=0&limit=20`;
    try {
        const resp = await axios.get(url);
        const { data } = resp;
        return data;
    } catch (err) {
        return {};
    }
};

export const getHotArtists = async () => {
    const url = `${baseApi}/top/artists?offset=0&limit=20`;
    try {
        const resp = await axios.get(url);
        const { data } = resp;
        return data;
    } catch (err) {
        return {};
    }
};

export const getHotPlaylists = async () => {
    const url = `${baseApi}/personalized?limit=20`;
    try {
        const resp = await axios.get(url);
        const { data } = resp;
        return data;
    } catch (err) {
        return {};
    }
};
