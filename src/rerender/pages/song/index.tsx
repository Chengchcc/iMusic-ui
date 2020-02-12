import React from "react";
import { useParams } from "react-router-dom";
import { getSongDetail } from "../../services";
import SongCommnet from "./component/SongComment";
import LyricComponent from "../../layout/playerbar/component/lyric";

interface TSongDetail {
    name: string;
    artists: { id: number; name: string }[];
    albums: { id: number; name: string };
    cover: string;
}

const Song: React.FC = () => {
    // state
    const { id: id_ } = useParams();
    const id = Number((id_ || "").substr(1));

    // effects
    React.useEffect(() => {
        if (id) {
            getSongDetail(id).then(de => {
                const detail = parser(de);
            });
        }
    }, [id]);

    // renders
    return (
        <>
            <div className="song">
                <div className="cover" />
                <div className="title" />
                <div className="mediainfo" />
                <LyricComponent className="lyric" songId={id} />
            </div>
            <SongCommnet id={id} />
        </>
    );
};

export default Song;

// parser

const parser = (org: any): TSongDetail => {
    console.log("org=>", org);
    const ar: any[] = org.songs.ar;
    const al: any = org.songs.al;
    return {
        name: org.songs.name,
        cover: al.picUrl,
        albums: { id: al.id, name: al.name },
        artists: ar.map(a => ({ id: a.id, name: a.name }))
    };
};
