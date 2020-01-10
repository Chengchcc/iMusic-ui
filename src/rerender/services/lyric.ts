import axios from "axios";
import { baseApi } from "../util/constant.json";
const getLyricById = async (id: number) => {
    try {
        const url = `${baseApi}/lyric?id=${id}`;
        const resp = await axios.get(url);
        const { data } = resp;
        return parse(data);
    } catch (err) {
        console.log("get lyric error=>", err);
        return { 0: "暂无歌词" };
    }
};

const parse = (data: any) => {
    const result: { [times: string]: string } = {};
    const defaultRes = { 0: "暂无歌词" };
    if (data.code !== 200) {
        throw data;
    } else {
        if (data.lrc === undefined) {
            return defaultRes;
        }

        const lyrics = data.lrc.lyric.split("\n");

        lyrics.map((e: any) => {
            const match = e.match(/\[.+\]/);

            if (!match) {
                return defaultRes;
            }

            const timestamp = match[0]
                .replace(/\D/g, ":")
                .replace(/^:|:$/g, "")
                .split(":");
            const content = e.replace(/\[.+\]/, "");
            const times =
                parseInt(timestamp[0]) * 60 * 1000 +
                parseInt(timestamp[1]) * 1000 +
                parseInt(timestamp[2]);

            result[times.toString()] = content;
        });
    }
    return result;
};

export default getLyricById;
