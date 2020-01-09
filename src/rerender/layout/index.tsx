import React from "react";
import TitleBar from "./titlebar";
import PlayerBar from "./playerbar";
import Sidebar from "./sidebar";
import AudioPlayer from "./audioplayer";
const Layout: React.FC = props => {
    return (
        <>
            <TitleBar title={"IMusic"} />
            {props.children}
            <PlayerBar />
            <AudioPlayer />
            <Sidebar />
        </>
    );
};

export default Layout;
