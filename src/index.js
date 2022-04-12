import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import {adminRoutes, mainRoutes} from './routes/index';
// redux
import {Provider} from "react-redux";
import store from "./store/store";
// ~~~~~
import App from "./App";
import './App.css';
ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path={'/admin'} element={<App/>}>
                    {/*admin路由到app组件*/}
                    {adminRoutes.map(route => {
                        return <Route key={route.path} {...route}/>
                    })}
                </Route>
                {mainRoutes.map(route => {
                    return <Route key={route.path} {...route}/>
                })}
                <Route path={'/admin/'} element={<Navigate to={adminRoutes[0].path}/>}/>
                <Route path={'*'} element={<Navigate to='/404'/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
