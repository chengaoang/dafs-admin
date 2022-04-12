import {post} from "../utils/request";

/**
 * 用户登录api
 * @param user
 * @returns {Promise<AxiosResponse<*>>}
 * usrename
 * password
 */
export function loginApi(user){
    return post("/user/login", user);
}
