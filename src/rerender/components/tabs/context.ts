/* eslint-disable @typescript-eslint/no-empty-function */
import React from "react";

interface Elements {
    tabs: number;
    panels: number;
}

interface TabState {
    activeIndex: number;
    setActive: React.Dispatch<React.SetStateAction<number>>;
}

export const tabsStateCtx = React.createContext<TabState>({
    activeIndex: 0,
    setActive: () => {}
});

export const elementsCtx = React.createContext<Elements>({
    tabs: 0,
    panels: 0
});
