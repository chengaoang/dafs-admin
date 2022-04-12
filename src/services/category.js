import {get,post,put,del} from "../utils/request";

export function categoryListApi(page,size=4) {
    return get('/category/limit', {page, size});
}
export function selectById(id) {
    return get(`/category/select/${id}`);
}

export function categoryCreateApi(data) {
    return post('/category/insert', data);
}

export function deleteOneById(id) {
    return del(`/category/delete/${id}`);
}

export function modifyOneById(id,data) {
    return put(`/category/update/${id}`, data);
}
export function getAll(){
    return get("/categorys",null);
}
