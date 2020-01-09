import React, { cloneElement, isValidElement } from "react";
import useConstant from "./usconstant";
import { elementsCtx, tabsStateCtx } from "./context";
import { useTabState, usePanelState } from "./hooks";

export const Tabs: React.FC = props => {
    const { children } = props;
    const [activeIndex, setActive] = React.useState(0);
    const elements = useConstant(() => ({ tabs: 0, panels: 0 }));

    return (
        <elementsCtx.Provider value={elements}>
            <tabsStateCtx.Provider value={{ activeIndex, setActive }}>
                {children}
            </tabsStateCtx.Provider>
        </elementsCtx.Provider>
    );
};

export const Tab: React.FC = props => {
    const { children } = props;
    const state = useTabState();

    if (typeof children === "function") {
        return children(state);
    }

    return isValidElement(children) ? cloneElement(children, state) : children;
};

export const Panel: React.FC = props => {
    const { children } = props;
    const isActive = usePanelState();
    return isActive ? <>{children}</> : null;
};
