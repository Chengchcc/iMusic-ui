import { fromJS } from "immutable";

const defaultState = fromJS({
    lyric: {}
});

export default (state = defaultState, action: any) => {
    if (action.type === "lyric/update") {
        return state.set("lyric", action.payload.lyric);
    }
    return state;
};
