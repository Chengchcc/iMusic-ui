import * as React from "react";
import { Provider } from "react-redux";
import store from "./reducers";
import BasicRoute from "./routes";
const App = () => {
    return (
        <Provider store={store}>
            <BasicRoute />
        </Provider>
    );
};

export default App;
