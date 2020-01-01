import React from "react";
import TitleBar from "./titlebar";
import PlayerBar from "./playerbar";
const Layout = ({ children }) => {
    return (
        <>
            <TitleBar title={"IMusic"} />
            {children}
            <PlayerBar />
        </>
    );
};

export default Layout;
