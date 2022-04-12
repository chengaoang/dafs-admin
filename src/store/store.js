import {createStore,combineReducers, compose,applyMiddleware} from "redux";
// compose applyMiddleware =》 异步插件
import product from "./reducers/product";
import notices from "./reducers/notice";
import thunk from "redux-thunk";
// thunk 异步插件

const rootReducer = combineReducers({
    product,// k=v =》 缩写了
    notices
})
export default createStore(rootReducer, compose(applyMiddleware(...[thunk])));
