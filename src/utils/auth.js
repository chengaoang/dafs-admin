export function getToken() {
    return localStorage.getItem('token');
}
export function setToken(token){
    localStorage.setItem('token',token);
}
export function clearToken() {
    localStorage.removeItem('token');
}
export function isLogined(){
    // 有token就re true，否则re false
    return !!localStorage.getItem('token');
}
