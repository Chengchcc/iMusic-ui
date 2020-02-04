import axios from "axios";
import { baseApi } from "../util/constant.json";
export const getSongDetail = async (id: number) => {
    const url = `${baseApi}/song?id=${id}`;
    try {
        const resp = await axios.get(url);
        const { data } = resp;
        return data;
    } catch (err) {
        return {};
    }
};

export const getAlbumDetail = async (id: number) => {
    const url = `${baseApi}/album?id=${id}`;
    try {
        const resp = await axios.get(url);
        const { data } = resp;
        return data;
    } catch (err) {
        return {};
    }
};

export const getArtistDetail = async (id: number) => {
    const url = `${baseApi}/artists?id=${id}`;
    try {
        const resp = await axios.get(url);
        const { data } = resp;
        return data;
    } catch (err) {
        return {};
    }
};

export const getPlaylistDetail = async (id: number) => {
    const url = `${baseApi}/playlist/detail?id=${id}`;
    try {
        const resp = await axios.get(url);
        const { data } = resp;
        return data;
    } catch (err) {
        return {};
    }
};
export const getSongUrl = async (id: number) => {
    const url = `${baseApi}/song/url?id=${id}`;
    try {
        const resp = await axios.get(url);
        const { data } = resp;
        return data;
    } catch (err) {
        return {};
    }
};
