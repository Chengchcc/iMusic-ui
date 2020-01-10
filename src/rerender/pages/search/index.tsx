/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";
import Main from "../../components/main";
import { Tabs } from "../../components/tabs";
import SearchTab from "./component/searchTab";
import "./style.less";
import SearchSong from "./component/searchSong";

const Search: React.FC = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [keywords, setKeywords] = React.useState("");
    return (
        <Main>
            <div className="search-bar">
                <input className="sg" ref={inputRef} />
                <button
                    className="search"
                    onClick={() => {
                        setKeywords(inputRef.current!.value);
                    }}
                />
            </div>
            <Tabs>
                <ul className="search-tabs">
                    <SearchTab title={"单曲"} onClick={() => {}} />
                    <SearchTab title={"专辑"} onClick={() => {}} />
                    <SearchTab title={"歌手"} onClick={() => {}} />
                    <SearchTab title={"歌单"} onClick={() => {}} />
                    <SearchTab title={"电台"} onClick={() => {}} />
                </ul>
                <SearchSong keywords={keywords} />
            </Tabs>
        </Main>
    );
};

export default Search;
