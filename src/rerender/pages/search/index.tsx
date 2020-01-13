/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import Main from "../../components/main";
import { Tabs } from "../../components/tabs";
import SearchTab from "./component/searchTab";
import SearchSong from "./component/searchSong";
import "./style.less";
import { useQuery } from "../../util/hooks";
import { useHistory } from "react-router-dom";

const Search: React.FC = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [keywords, setKeywords] = React.useState("");
    const [currentIndex, setActive] = React.useState(0);
    const history = useHistory();
    const params = useQuery();
    // handlers
    const onSearch = (k?: string, type?: number) => {
        const url = `/search?keywords=${k || keywords}&type=${type ||
            currentIndex}`;
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
            setActive(parseInt(type));
        }
    });

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
                    <SearchTab
                        title={"电台"}
                        onClick={i => onSearch(undefined, i)}
                    />
                </ul>
                <SearchSong keywords={keywords} />
            </Tabs>
        </Main>
    );
};

export default Search;
