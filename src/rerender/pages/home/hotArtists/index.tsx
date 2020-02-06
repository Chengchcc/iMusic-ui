import React, { ReactNode } from "react";
import { usePanelState } from "../../../components/tabs/hooks";
import { TArtist } from "../type";
import { getArtistDetail } from "../../../services";
import ColumGroup from "../../../components/columGroup";
import { chunk } from "../../../util";
import { TSong } from "../../../types";
interface Props {
    artists: TArtist[];
}
const HotArtists: React.FC<Props> = props => {
    const isActive = usePanelState();
    const { artists } = props;
    const cols: ReactNode[] = [];
    const artistsChunk = chunk(artists, 4);
    artistsChunk.forEach((chk, idx) => {
        cols.push(
            <ColumGroup
                key={idx + ""}
                data={chk}
                renderData={el => (
                    <div className="advanced-container">
                        <div
                            className="thumb-img"
                            style={{ backgroundImage: `url(${el.avator})` }}
                        />
                        <span>{el.name}</span>
                    </div>
                )}
                getDetail={(id, callback) => {
                    getArtistDetail(id).then(data => callback(parser(data)));
                }}
            />
        );
    });
    return (
        <div className={isActive ? "pannel" : "pannel hide"}>
            <div className="advanced-res">{cols}</div>
        </div>
    );
};

export default HotArtists;
// parser

const parser = (org: any) => {
    const artist = org.artist;
    const songs: any[] = org.hotSongs;
    const _songs: TSong[] = [];
    songs.forEach(song => {
        _songs.push({
            id: song.id,
            name: song.name,
            artists: song.ar,
            album: song.al,
            duration: song.dt
        });
    });
    return {
        cover: artist.picUrl,
        songs: _songs
    };
};
