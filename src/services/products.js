import {get,post,put,del} from "../utils/request";

/**
 *
 * @param page 当前页
 * @param per 每页展示条数
 * @returns {Promise<AxiosResponse<*>>}
 */
export function listApi(page = 1,per=4){
    return get('/products/limit', {page,per});
}


export function createApi(data){
    return post('/products/insert', data);
}

/**
 * 根据id获取一条数据
 * @param id
 * @returns {Promise<AxiosResponse<*>>}
 */
export function getOneByID(id){
    return get(`/products/select/${id}`)
}

export function modifyOne(id, data){
    return put(`/products/update/${id}`, data);
}

export function delOne(id){
    return del(`/products/delete/${id}`)
}

