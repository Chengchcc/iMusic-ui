import React from "react";
import useConstant from "./usconstant";
import { tabsStateCtx, elementsCtx } from "./context";

export const useTabState = () => {
    const { activeIndex, setActive } = React.useContext(tabsStateCtx);
    const elements = React.useContext(elementsCtx);

    const tabIndex = useConstant(() => {
        const currentIndex = elements.tabs;
        elements.tabs += 1;

        return currentIndex;
    });

    const onClick = useConstant(() => () => setActive(tabIndex));

    const state = React.useMemo(
        () => ({
            isActive: activeIndex === tabIndex,
            onClick
        }),
        [activeIndex, onClick, tabIndex]
    );

    return state;
};

export const usePanelState = () => {
    const { activeIndex } = React.useContext(tabsStateCtx);
    const elements = React.useContext(elementsCtx);

    const panelIndex = useConstant(() => {
        const currentIndex = elements.panels;
        elements.panels += 1;

        return currentIndex;
    });

    return panelIndex === activeIndex;
};
