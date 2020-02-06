import React, { ReactNode } from "react";
import { usePanelState } from "../../../components/tabs/hooks";
import { TPlaylist } from "../type";
import { getPlaylistDetail } from "../../../services";
import ColumGroup from "../../../components/columGroup";
import { chunk } from "../../../util";
import { TSong } from "../../../types";
interface Props {
    playlists: TPlaylist[];
}
const HotPlaylists: React.FC<Props> = props => {
    const isActive = usePanelState();
    const { playlists } = props;
    const cols: ReactNode[] = [];
    const playlistsChunk = chunk(playlists, 4);
    playlistsChunk.forEach((chk, idx) => {
        cols.push(
            <ColumGroup
                key={idx + ""}
                data={chk}
                renderData={el => (
                    <div className="advanced-container">
                        <div
                            className="thumb-img"
                            style={{ backgroundImage: `url(${el.cover})` }}
                        />
                        <span>{el.name}</span>
                    </div>
                )}
                getDetail={(id, callback) => {
                    getPlaylistDetail(id).then(data => callback(parser(data)));
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

export default HotPlaylists;
// parser

const parser = (org: any) => {
    console.log("org=>", org);
    const songs: any[] = org.playlist.tracks;
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
        cover: org.playlist.coverImgUrl,
        songs: _songs
    };
};
