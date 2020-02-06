import React, { ReactNode } from "react";
import { usePanelState } from "../../../components/tabs/hooks";
import { TAlbum } from "../type";
import { chunk } from "../../../util";
import ColumGroup from "../../../components/columGroup";
import { getAlbumDetail } from "../../../services";
import { TSong } from "../../../types";
interface Props {
    albums: TAlbum[];
}
const HotAlbums: React.FC<Props> = props => {
    const isActive = usePanelState();
    const { albums } = props;

    const cols: ReactNode[] = [];
    const albumsChunk = chunk(albums, 4);
    albumsChunk.forEach((chk, idx) => {
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
                    getAlbumDetail(id).then(data => callback(parser(data)));
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

export default HotAlbums;

// parser

const parser = (org: any) => {
    const album = org.album;
    const songs: any[] = org.songs;
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
        cover: album.picUrl,
        artist: album.artist,
        songs: _songs
    };
};
