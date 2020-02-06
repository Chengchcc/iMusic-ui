import * as React from "react";
import Main from "../../components/main";
import { Tabs } from "../../components/tabs";
import PageTab from "./component/pageTabs";
import HotAlbums from "./hotAlbums";
import HotPlaylists from "./hotPlaylists";
import HotArtists from "./hotArtists";
import "./style.less";

import {
    getHotAlbums,
    getHotPlaylists,
    getHotArtists
} from "../../services/home";
import Loader from "../../components/loader";
import { TAlbum, TPlaylist, TArtist } from "./type";

const Home: React.FC<{}> = () => {
    const [albums, setAlbums] = React.useState<TAlbum[]>([]);
    const [playlists, setPlaylists] = React.useState<TPlaylist[]>([]);
    const [artists, setArtists] = React.useState<TArtist[]>([]);
    const [loading, setLoading] = React.useState(true);
    // effects
    React.useEffect(() => {
        Promise.all([getHotAlbums(), getHotPlaylists(), getHotArtists()]).then(
            ([albums_, playlists_, artists_]) => {
                setAlbums(parseAlbums(albums_));
                setPlaylists(parsePlaylists(playlists_));
                setArtists(parseArtists(artists_));
                setLoading(false);
            }
        );
    }, []);

    return (
        <Main>
            {loading && <Loader show />}
            {!loading && (
                <Tabs currentIndex={0}>
                    <ul className="page-tabs">
                        <PageTab title={"新碟上架"} />
                        <PageTab title={"推荐歌单"} />
                        <PageTab title={"热门歌手"} />
                    </ul>
                    <HotAlbums albums={albums} />
                    <HotPlaylists playlists={playlists} />
                    <HotArtists artists={artists} />
                </Tabs>
            )}
        </Main>
    );
};

export default Home;

// parser
const parseAlbums = (org: any): TAlbum[] => {
    const albums: any[] = org.albums;
    return albums.map(al => {
        return {
            id: al.id,
            name: al.name,
            cover: al.picUrl
        };
    });
};

const parsePlaylists = (org: any): TPlaylist[] => {
    const result: any[] = org.result;
    return result.map(re => {
        return {
            id: re.id,
            name: re.name,
            cover: re.picUrl
        };
    });
};

const parseArtists = (org: any): TArtist[] => {
    const artists: any[] = org.artists;
    return artists.map(ar => {
        return {
            id: ar.id,
            name: ar.name,
            avator: ar.picUrl
        };
    });
};
