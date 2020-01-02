import React from "react";
import TitleBar from "./titlebar";
import PlayerBar from "./playerbar";
import Sidebar from "./sidebar";
const Layout: React.FC = props => {
    return (
        <>
            <TitleBar title={"IMusic"} />
            {props.children}
            <PlayerBar />
            <Sidebar />
        </>
    );
};

export default Layout;
