import axios from "axios";
import {getToken} from "./auth";

const instance = axios.create({
    baseURL: 'http://localhost:8888',
    timeout: 50000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    if (getToken()) config.headers['token'] = getToken();
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data; // 可以在这里整一些处理响应回来的数据的操作
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

/**
 *
 * @param url
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export function get(url, params){
    return instance.get(url,{
        params
    })
}

/**
 *
 * @param url
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export function post(url, data){
    return instance.post(url, data);
}

/**
 *
 * @param url
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export function put(url, data){
    return instance.put(url, data);
}

/**
 *
 * @param url
 * @returns {Promise<AxiosResponse<any>>}
 */
export function del(url){
    return instance.delete(url);
}
