import React from "react";
import Main from "../../components/main";
import "./style.less";

const Search: React.FC = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <Main>
            <div className="search-bar">
                <input className="sg" ref={inputRef} />
                <button className="search" />
            </div>
        </Main>
    );
};

export default Search;
