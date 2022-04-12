import './App.css'; // antd css 在里面
import {Outlet} from 'react-router';
import Frame from "./components/Frame/Frame";
import { isLogined } from "./utils/auth";
import {Navigate} from "react-router-dom";
import React from "react";

function App() {
    return ( isLogined()?
        <div className='App'>
            <Frame>
                <Outlet/>
            </Frame>
        </div>:<Navigate to='/login'/>
    );
}

export default App;
