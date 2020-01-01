import * as React from "react";
import Home from "./home";
import Layout from "../layout";
import { Provider } from "react-redux";
import store from "../reducers";
const App = () => {
    return (
        <Provider store={store}>
            <Layout>
                <Home />
            </Layout>
        </Provider>
    );
};

export default App;
