import React from "react";

const useClickRest = (params: {
    id: string;
    handler: () => any;
    onFocus?: () => {};
    onBlur?: () => {};
}) => {
    const { id, handler, onFocus, onBlur } = params;
    const foucsRef = React.useRef(false);

    React.useEffect(() => {
        const element = document.getElementById(id);
        const foucsHandler = () => {
            foucsRef.current = true;
            if (typeof onFocus === "function") {
                onFocus();
            }
        };
        const blurHandler = () => {
            foucsRef.current = false;
            if (typeof onBlur === "function") {
                onBlur();
            }
        };
        element?.addEventListener("mouseenter", foucsHandler);
        element?.addEventListener("mouseleave", blurHandler);
        return () => {
            element?.removeEventListener("mouseenter", foucsHandler);
            element?.removeEventListener("mouseleave", blurHandler);
        };
    });
    React.useEffect(() => {
        const handler_ = () => {
            if (!foucsRef.current) {
                handler();
            }
        };
        document.addEventListener("click", handler_);
        return () => document.removeEventListener("click", handler_);
    }, []);
};

export default useClickRest;
