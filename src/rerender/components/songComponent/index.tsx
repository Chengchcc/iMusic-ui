import React from "react";
import { useHistory } from "react-router-dom";
import store from "../../reducers";
import { createAction } from "../../util/aciton";
import { readableSecond } from "../../util";
import { TSong } from "../../types";
import "./style.less";

const SongComponent: React.SFC<TSong> = props => {
    const { id, name, artists, album, duration } = props;
    const history = useHistory();
    const artistsViews: (string | JSX.Element)[] = [];
    artists.forEach((artist, idx) => {
        artistsViews.push("/");
        artistsViews.push(
            <a key={idx} onClick={() => history.push(`/artist:${artist.id}`)}>
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
            <td>
                <button className="play" onClick={() => handleSong("play")} />
            </td>
            <td className="w0">
                <a onClick={() => history.push(`/song:${id}`)}>{name}</a>
            </td>
            <td>
                <span className="not-show">
                    <button className="add" onClick={() => handleSong("add")} />
                    <button className="download" />
                </span>
            </td>
            <td className="w1">{artistsViews.slice(1)}</td>
            <td className="w2">
                <a
                    onClick={() => history.push(`/album:${album.id}`)}
                >{`《${album.name}》`}</a>
            </td>
            <td>{readableSecond(duration)}</td>
        </tr>
    );
};

export default SongComponent;
