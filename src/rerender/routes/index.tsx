import React from "react";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import Home from "../pages/home";
import Song from "../pages/song";
import Search from "../pages/search";
import Layout from "../layout";
import Artist from "../pages/artist";
import Album from "../pages/album";

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Layout>
                <Redirect from="/" to="/search" />
                <Route exact path="/home" component={Home} />
                <Route exact path="/search" component={Search} />
                <Route exact path="/song:id" component={Song} />
                <Route exact path="/artist:id" component={Artist} />
                <Route exact path="/album:id" component={Album} />
                <Route />
            </Layout>
        </Switch>
    </HashRouter>
);

export default BasicRoute;
