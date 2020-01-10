import { combineReducers } from "redux-immutable";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import playListReducer from "./playlist";
import lyricReducer from "./lyric";
import searchReducer from "./search";

const reducer = combineReducers({
    playlist: playListReducer,
    lyric: lyricReducer,
    search: searchReducer
});

const composeEnhancers = compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
export default store;
