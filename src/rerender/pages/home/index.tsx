import * as React from "react";
import Loader from "../../components/loader";
import Main from "../../components/main";

const Home: React.FC<{}> = () => {
    return (
        <Main>
            <Loader show />
        </Main>
    );
};

export default Home;
