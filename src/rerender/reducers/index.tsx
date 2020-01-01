import { combineReducers } from "redux-immutable";
import { createStore, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import playListReducer from "./playlist";

const reducer = combineReducers({
    playlist: playListReducer
});

const composeEnhancers = compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));
export default store;
