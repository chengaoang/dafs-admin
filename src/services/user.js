import {get,post,put,del} from "../utils/request";

export function postUser(user) {
    return post('/users',user);
}
export function deleteUser(id){
    return del(`/users/${id}`);
}
export function putUser(user){
    return put(`/users`, user);
}
export function getById(id) {
    return get(`/users/${id}`,null);
}
export function getAll(){
    return get(`/users`,null);
}
export function getInfo() {
    return get('/users/info',null);
}
