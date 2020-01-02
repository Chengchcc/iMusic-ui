import React from "react";
import "./style.less";

const Sidebar = () => {
    const [isShow, setIsShow] = React.useState(false);

    // React.useEffect(() => {
    //     const element = document.getElementById("sidebar-container");
    //     element?.addEventListener("mouseenter", showSidebar);
    //     element?.addEventListener("mouseleave", hideSideBar);
    //     return () => {
    //         element?.removeEventListener("mouseenter", showSidebar);
    //         element?.removeEventListener("mouseleave", hideSideBar);
    //     };
    // });

    // const showSidebar = () => {
    //     console.log("show");
    //     setIsShow(true);
    // };
    // const hideSideBar = () => {
    //     console.log("hide");
    //     setIsShow(false);
    // };

    return (
        <div id="sidebar-container" className="sidebar-container ">
            <div className="sidebar"></div>
        </div>
    );
};

export default Sidebar;
