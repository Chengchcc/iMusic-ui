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
        return {};
    }
};

const parse = (data: any) => {
    const result: { [times: string]: string } = {};
    if (data.code !== 200) {
        throw data;
    } else {
        if (data.lrc === undefined) {
            return result;
        }

        const lyrics = data.lrc.lyric.split("\n");

        lyrics.map((e: any) => {
            const match = e.match(/\[.+\]/);

            if (!match) {
                return result;
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
    return {};
};

export default getLyricById;
