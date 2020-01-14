import React from "react";
import useClickRest from "../../../../components/useClickRest";

import "./style.less";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { readableSecond } from "../../../../util";
import store from "../../../../reducers";
import { createAction } from "../../../../util/aciton";
interface Props {
    hide: () => any;
}

const PlayList: React.FC<Props> = props => {
    const { hide } = props;

    // selectors
    const seqPlaylistIMMU = useSelector((state: any) =>
        state.get("playlist").get("seqPlaylist")
    );
    const seqPlaylist: any[] = seqPlaylistIMMU.toJS();

    // effects
    useClickRest({
        id: "playBar-playList",
        handler: hide
    });
    // renders
    const songs = seqPlaylist.map(el => <SongComponent {...el} key={el.id} />);

    const lists = (
        <div className="playList-body">
            <table>
                <tbody>{songs}</tbody>
            </table>
        </div>
    );
    const emptyList = (
        <div className="playList-body">
            <span>{"暂无"}</span>
        </div>
    );

    return (
        <div id="playBar-playList" className="playBar-playList">
            <div className="playList-header"></div>
            {songs.length ? lists : emptyList}
        </div>
    );
};

export default PlayList;

interface SongProps {
    id: number;
    name: string;
    artists: {
        id: number;
        name: string;
    }[];
    album: { id: number; name: string };
    duration: number;
}

const SongComponent: React.SFC<SongProps> = props => {
    const { id, name, artists, duration, album } = props;
    const history = useHistory();
    const artistsViews: (string | JSX.Element)[] = [];
    artists.forEach(artist => {
        artistsViews.push("/");
        artistsViews.push(
            <a
                key={artist.id + ""}
                onClick={() => history.push(`/artist:${artist.id}`)}
            >
                {artist.name}
            </a>
        );
    });

    // handlers
    const handleSong = (type: string) => {
        store.dispatch(
            createAction(`playlist/${type}`)({
                song: {
                    id,
                    artists,
                    duration,
                    album,
                    name
                }
            })
        );
    };
    return (
        <tr>
            <td className="w0">
                <button className="play" onClick={() => handleSong("play")} />
            </td>
            <td className="w1">
                <a onClick={() => history.push(`/song:${id}`)}>{name}</a>
            </td>
            <td className="w2">
                <span className="not-show">
                    <button
                        className="delete-trash"
                        onClick={() => handleSong("delete")}
                    />
                </span>
            </td>
            <td className="w3">{artistsViews.slice(1)}</td>
            <td className="w4">{readableSecond(duration)}</td>
        </tr>
    );
};
