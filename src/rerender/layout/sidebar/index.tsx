import React from "react";
import "./style.less";
import { useHistory } from "react-router-dom";

const Sidebar = () => {
    const history = useHistory();

    const toSearch = React.useCallback(() => {
        history.push("search");
    }, []);

    const toHome = React.useCallback(() => {
        history.push("home");
    }, []);

    return (
        <div id="sidebar-container" className="sidebar-container ">
            <div className="sidebar">
                <button className="home" onClick={toHome} />
                <button className="search" onClick={toSearch} />
                <button className="user" />
                <button className="favorite" />
                <button className="setting" />
            </div>
        </div>
    );
};

export default Sidebar;
