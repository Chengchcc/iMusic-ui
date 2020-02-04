/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import Main from "../../components/main";
import { Tabs } from "../../components/tabs";
import SearchTab from "./component/searchTab";
import SearchSong from "./searchSong";
import SearchAlbum from "./searchAlbum";
import SearchArtist from "./searchArtist";
import SearchPlaylist from "./searchPlaylist";

import "./style.less";
import { useQuery } from "../../util/hooks";
import { useHistory } from "react-router-dom";

const Search: React.FC = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const indexRef = React.useRef(0);
    const [keywords, setKeywords] = React.useState("");
    const [currentIndex, setActive] = React.useState(0);
    const history = useHistory();
    const params = useQuery();
    // handlers
    const onSearch = (k?: string, type?: number) => {
        const url = `/search?keywords=${k ||
            inputRef.current?.value}&type=${index2Type(
            type === undefined ? indexRef.current : type
        )}`;
        history.push(url);
    };
    // effects
    React.useEffect(() => {
        const keydownHandler = (e: KeyboardEvent) => {
            if (e.keyCode === 13) {
                onSearch(inputRef.current?.value);
            }
        };
        const addHandler = () => {
            document.addEventListener("keydown", keydownHandler);
        };
        const removeHandler = () => {
            document.removeEventListener("keydown", keydownHandler);
        };
        inputRef.current?.addEventListener("focus", addHandler);
        inputRef.current?.addEventListener("blur", removeHandler);
        return () => {
            inputRef.current?.removeEventListener("focus", addHandler);
            inputRef.current?.removeEventListener("blur", removeHandler);
            removeHandler();
        };
    }, []);

    React.useEffect(() => {
        const keywords_ = params.get("keywords");
        const type = params.get("type");
        if (keywords_) {
            inputRef.current!.value = keywords_;
            setKeywords(keywords_);
        }
        if (type) {
            setActive(type2Index(Number(type)));
            indexRef.current = type2Index(Number(type));
        }
    }, [params]);

    return (
        <Main>
            <div className="search-bar">
                <input className="sg" ref={inputRef} />
                <button
                    className="search"
                    onClick={() => onSearch(inputRef.current?.value)}
                />
            </div>
            <Tabs currentIndex={currentIndex}>
                {/* tab button */}
                <ul className="search-tabs">
                    <SearchTab
                        title={"单曲"}
                        onClick={i => onSearch(undefined, i)}
                    />
                    <SearchTab
                        title={"专辑"}
                        onClick={i => onSearch(undefined, i)}
                    />
                    <SearchTab
                        title={"歌手"}
                        onClick={i => onSearch(undefined, i)}
                    />
                    <SearchTab
                        title={"歌单"}
                        onClick={i => onSearch(undefined, i)}
                    />
                </ul>
                {/* panel list */}
                <SearchSong keywords={keywords} />
                <SearchAlbum keywords={keywords} />
                <SearchArtist keywords={keywords} />
                <SearchPlaylist keywords={keywords} />
            </Tabs>
        </Main>
    );
};

export default Search;

const index2Type = (idx: number) => {
    switch (idx) {
        case 0:
            return 1;
        case 1:
            return 10;
        case 2:
            return 100;
        case 3:
            return 1000;
    }
};

const type2Index = (type: number) => {
    switch (type) {
        case 1:
            return 0;
        case 10:
            return 1;
        case 100:
            return 2;
        case 1000:
            return 3;
        default:
            return 4;
    }
};
